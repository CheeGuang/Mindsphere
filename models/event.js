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
  const connection = await sql.connect(dbConfig);
  const request = connection.request();
  const result = await request.execute("usp_get_all_event");

  connection.close();

  return result.recordset.map(
    (row) =>
      new Event(
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
  }
}

module.exports = event;
