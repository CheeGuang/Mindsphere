// ========== Packages ==========
// Initialise node packages here
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class event {
  constructor(
    eventID,
    type,
    title,
    price,
    oldPrice, // Add oldPrice
    classSize, // Add classSize
    duration,
    lunchProvided, // Add lunchProvided
    lessonMaterialsProvided, // Add lessonMaterialsProvided
    accessToMembership, // Add accessToMembership
    availableDates,
    time,
    totalParticipants,
    venue,
    picture
  ) {
    this.eventID = eventID;
    this.type = type;
    this.title = title;
    this.price = price;
    this.oldPrice = oldPrice; // Assign oldPrice to the instance
    this.classSize = classSize; // Assign classSize to the instance
    this.duration = duration;
    this.lunchProvided = lunchProvided; // Assign lunchProvided to the instance
    this.lessonMaterialsProvided = lessonMaterialsProvided; // Assign lessonMaterialsProvided to the instance
    this.accessToMembership = accessToMembership; // Assign accessToMembership to the instance
    this.availableDates = availableDates;
    this.time = time;
    this.totalParticipants = totalParticipants;
    this.venue = venue;
    this.picture = picture;
  }

  // Fetch all events
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
            row.oldPrice, // Add oldPrice
            row.classSize, // Add classSize
            row.duration,
            row.lunchProvided, // Add lunchProvided
            row.lessonMaterialsProvided, // Add lessonMaterialsProvided
            row.accessToMembership, // Add accessToMembership
            row.availableDates,
            row.time,
            row.totalParticipants,
            row.venue,
            row.picture
          )
      );
    } catch (error) {
      console.error("Database error:", error);
      throw error; // Rethrow to handle in the controller
    }
  }

  // Fetch events by memberID
  static async getEventByMemberId(memberID) {
    try {
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
            row.oldPrice, // Add oldPrice
            row.classSize, // Add classSize
            row.duration,
            row.lunchProvided, // Add lunchProvided
            row.lessonMaterialsProvided, // Add lessonMaterialsProvided
            row.accessToMembership, // Add accessToMembership
            row.availableDates,
            row.time,
            row.totalParticipants,
            row.venue,
            row.picture
          )
      );

      connection.close();

      return [...memberEvent];
    } catch (error) {
      console.error("Database error:", error);
      throw error; // Rethrow to handle in the controller
    }
  }

  // Function to get unique event types with associated pictures
  static async getUniqueEventTypes() {
    try {
      const connection = await sql.connect(dbConfig); // Connect to the database
      const request = connection.request(); // Create a new request
      const result = await request.execute("usp_get_unique_event_types"); // Execute the stored procedure
      connection.close(); // Close the connection
      return result.recordset; // Return the result (list of unique types with pictures)
    } catch (error) {
      console.error("Error retrieving unique event types:", error);
      throw error; // Rethrow to handle in the controller
    }
  }

  // Enroll a member to an event
  static async enrollMemberToEvent(
    memberID,
    eventID,
    fullName,
    age,
    schoolName,
    interests,
    medicalConditions,
    lunchOption,
    specifyOther
  ) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();
      request.input("memberID", sql.Int, memberID);
      request.input("eventID", sql.Int, eventID);
      request.input("fullName", sql.NVarChar(100), fullName);
      request.input("age", sql.NVarChar(10), age);
      request.input("schoolName", sql.NVarChar(100), schoolName);
      request.input("interests", sql.NVarChar(200), interests);
      request.input("medicalConditions", sql.NVarChar(500), medicalConditions);
      request.input("lunchOption", sql.NVarChar(100), lunchOption);
      request.input("specifyOther", sql.NVarChar(200), specifyOther);

      await request.execute("usp_enrollMemberToEvent");
      connection.close();

      return { success: true, message: "Enrollment successful." };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
}

module.exports = event;
