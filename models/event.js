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
    oldPrice,
    classSize,
    duration,
    lunchProvided,
    lessonMaterialsProvided,
    accessToMembership,
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

  // Fetch events by eventID
  static async getEventById(eventID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("eventID", sql.NVarChar(100), eventID);
      const result = await request.execute("usp_get_event_by_id");

      const eventDetails = result.recordset.map(
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

      return [...eventDetails];
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

  static async updateEvent(eventID, updatedData) {
    try {
        const connection = await sql.connect(dbConfig);
        const request = connection.request();

        request.input("eventID", sql.Int, eventID);
        request.input("title", sql.NVarChar(255), updatedData.title);
        request.input("price", sql.Float, updatedData.price);
        request.input("availableDates", sql.NVarChar(255), updatedData.availableDates);
        request.input("venue", sql.NVarChar(255), updatedData.venue);
        request.input("duration", sql.NVarChar(255), updatedData.duration);
        request.input("picture", sql.NVarChar(255), updatedData.picture);

        const result = await request.execute("usp_update_event"); // Ensure stored procedure exists
        connection.close();

        return result.recordset; // Return the updated event if needed
    } catch (error) {
        console.error("Database error:", error); // Log the error
        throw error; // Rethrow to handle in the controller
    }
  }

  // Function to delete an event by eventID
static async deleteEventById(eventID) {
  try {
      const connection = await sql.connect(dbConfig); // Connect to the database
      const request = connection.request(); // Create a new request

      request.input("eventID", sql.Int, eventID); // Pass eventID as input parameter
      await request.execute("usp_delete_event_by_id"); // Execute the stored procedure to delete

      connection.close(); // Close the connection
      return { message: "Event deleted successfully" }; // Return success message
  } catch (error) {
      console.error("Error deleting event:", error); // Log the error
      throw error; // Rethrow to handle in the controller
  }
}

  // Enroll a member to an event and return the memberEventID
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

      // Set up input parameters
      request.input("memberID", sql.Int, memberID);
      request.input("eventID", sql.Int, eventID);
      request.input("fullName", sql.NVarChar(100), fullName);
      request.input("age", sql.NVarChar(10), age);
      request.input("schoolName", sql.NVarChar(100), schoolName);
      request.input("interests", sql.NVarChar(200), interests);
      request.input("medicalConditions", sql.NVarChar(500), medicalConditions);
      request.input("lunchOption", sql.NVarChar(100), lunchOption);
      request.input("specifyOther", sql.NVarChar(200), specifyOther);

      // Output parameter to capture the new memberEventID
      request.output("memberEventID", sql.Int);

      // Execute the stored procedure and capture the result
      const result = await request.execute("usp_enrollMemberToEvent");

      // Retrieve the memberEventID from the output parameter
      const memberEventID = result.output.memberEventID;

      // Close the connection
      connection.close();

      // Return success response with memberEventID
      return {
        success: true,
        message: "Enrollment successful.",
        memberEventID: memberEventID,
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }

  // Add this function inside the event class
  static async getEventById(eventID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Add the input parameter for eventID
      request.input("eventID", sql.Int, eventID);

      // Execute the stored procedure
      const result = await request.execute("usp_get_event_by_eventID");

      // Assuming only one event is returned, map the result to the event object
      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new event(
          row.eventID,
          row.type,
          row.title,
          row.price,
          row.oldPrice,
          row.classSize,
          row.duration,
          row.lunchProvided,
          row.lessonMaterialsProvided,
          row.accessToMembership,
          row.availableDates,
          row.time,
          row.totalParticipants,
          row.venue,
          row.picture
        );
      }

      connection.close();
      return null; // Return null if no event found
    } catch (error) {
      console.error("Database error:", error);
      throw error; // Rethrow to handle in the controller
    }
  }

  // Function to get event details for invoice
  static async getEventDetailsForInvoice(eventID) {
    console.log(`[DEBUG] Fetching event details for eventID: ${eventID}`);

    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("eventID", sql.Int, eventID);

      const result = await request.execute("usp_get_event_by_eventID");
      connection.close();

      if (result.recordset.length > 0) {
        console.log(`[DEBUG] Event details retrieved for eventID: ${eventID}`);
        const row = result.recordset[0];
        return new event(
          row.eventID,
          row.type,
          row.title,
          row.price,
          row.oldPrice,
          row.classSize,
          row.duration,
          row.lunchProvided,
          row.lessonMaterialsProvided,
          row.accessToMembership,
          row.availableDates,
          row.time,
          row.totalParticipants,
          row.venue,
          row.picture
        );
      } else {
        console.log(`[DEBUG] No event found for eventID: ${eventID}`);
      }
      return null;
    } catch (error) {
      console.error("[DEBUG] Database error:", error);
      throw error;
    }
  }
}

module.exports = event;
