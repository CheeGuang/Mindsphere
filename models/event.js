// ========== Packages ==========
// Initialise node packages here
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class event {
  constructor(eventID, type, title, price, duration, availableDates, time, totalParticipants, venue) {
    this.eventID = eventID;
    this.type = type;
    this.title = title;
    this.price = price;
    this.duration = duration;
    this.availableDates = availableDates;
    this.time = time;
    this.totalParticipants = totalParticipants;
    this.venue = venue;
  }


  static async getAllEvent() {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();
      const result = await request.execute("usp_get_all_event");
      connection.close();
      return result.recordset.map(
        (row) =>
          new event(
            row.eventID,
            row.type,
            row.title,
            row.price,
            row.duration,
            row.availableDates,
            row.time,
            row.totalParticipants,
            row.venue
          )
      );
    } catch (error) {
      console.error("Database error:", error);
      throw error; // Rethrow to handle in the controller
    }
  }

  
  static async getEventByMemberId(memberID) {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();

    request.input("memberID", sql.NVarChar(100), memberID);
    const result = await request.execute("usp_get_event_by_member_id");

    const memberEvent = result.recordset.map(
      (row) =>
        new event(
          row.eventID,
          row.type,
          row.title,
          row.price,
          row.duration,
          row.availableDates,
          row.time,
          row.totalParticipants,
          row.venue
        )
    );

    connection.close();

    return [...memberEvent];
  }
  
}

module.exports = event;
