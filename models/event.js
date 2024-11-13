// ========== Packages ==========
// Initialise node packages here
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const axios = require("axios");

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
    picture,
    memberEventID,
    fullName,
    experience
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
    this.memberEventID = memberEventID;
    this.fullName = fullName;
    this.experience = experience;
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
            row.picture,
            row.memberEventID,
            row.fullName,
            row.experience // Include the new attribute
          )
      );

      console.log(memberEvent);
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
      request.input(
        "availableDates",
        sql.NVarChar(255),
        updatedData.availableDates
      );
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

  static async sendTelegramMessage(eventData, eventId) {
    const botToken = process.env.TelegramBotAPIToken; // Replace with your bot token
    const channelID = "@Mindsphere_FSDP_Cooking"; // Replace with your channel username or chat ID

    console.log("Debug: Preparing to send Telegram message.");
    console.log(`Debug: botToken = ${botToken}`);
    console.log(`Debug: channelID = ${channelID}`);
    console.log("Debug: eventData =", eventData);

    // Prepare the caption with event details
    const caption = `📣 New Event Alert! 🎉 We're excited to announce a new event! 
  Here are the details: 
  🌟 Title: ${eventData.title}
  📅 Type: ${eventData.type}
  💰 Price: ${eventData.price}
  👥 Class Size: ${eventData.classSize}
  ⏳ Duration: ${eventData.duration}
  🍽️ Lunch Provided: ${eventData.lunchProvided ? "Yes" : "No"}
  📚 Lesson Materials Provided: ${
    eventData.lessonMaterialsProvided ? "Yes" : "No"
  }
  🗓️ Available Dates: ${eventData.availableDates}
  🕒 Time: ${eventData.time}
  📍 Venue: ${eventData.venue}
  
  Don't miss out on this fantastic opportunity! 
  Join us for an enriching experience. 
  If you have any questions, feel free to ask!
  Sign up now at https://mindsphere.onrender.com/guestWorkshopInformation.html?eventID=${eventId}`;

    console.log("Debug: caption prepared =", caption);

    try {
      // Send the image with the event details as caption
      console.log("Debug: Sending photo to Telegram.");
      const photoResponse = await axios.post(
        `https://api.telegram.org/bot${botToken}/sendPhoto`,
        {
          chat_id: channelID,
          photo: eventData.picture, // URL of the image
          caption: caption,
          parse_mode: "Markdown", // Allows bold and italic text
        }
      );

      console.log(
        "Telegram photo message sent successfully:",
        photoResponse.data
      );
    } catch (error) {
      console.error(
        "Error sending Telegram photo message:",
        error.response ? error.response.data : error.message
      );
      console.log("Debug: Failed to send photo. Error details =", error);
      throw error;
    }
  }

  // Function to create an event
  static async createEvent(newData) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("type", sql.NVarChar(100), newData.type);
      request.input("title", sql.NVarChar(200), newData.title);
      request.input("price", sql.Decimal(10, 2), newData.price);
      request.input("oldPrice", sql.Decimal(10, 2), newData.oldPrice || null); // Allow null
      request.input("classSize", sql.NVarChar(50), newData.classSize);
      request.input("duration", sql.NVarChar(50), newData.duration);
      request.input(
        "lunchProvided",
        sql.Bit,
        newData.lunchProvided !== undefined ? newData.lunchProvided : 1
      ); // Default to 1
      request.input(
        "lessonMaterialsProvided",
        sql.Bit,
        newData.lessonMaterialsProvided !== undefined
          ? newData.lessonMaterialsProvided
          : 1
      ); // Default to 1
      request.input(
        "accessToMembership",
        sql.Bit,
        newData.accessToMembership !== undefined
          ? newData.accessToMembership
          : 1
      ); // Default to 1
      request.input(
        "availableDates",
        sql.NVarChar(sql.MAX),
        newData.availableDates
      ); // Handle as NVARCHAR(MAX)
      request.input("time", sql.NVarChar(50), newData.time);
      request.input(
        "totalParticipants",
        sql.Int,
        newData.totalParticipants || 0
      ); // Default to 0
      request.input("venue", sql.NVarChar(500), newData.venue);
      request.input("picture", sql.NVarChar(500), newData.picture);

      const result = await request.execute("usp_create_event");

      connection.close();

      // Return the newly created eventID
      const newEventID = result.recordset[0].newEventID;

      await event.sendTelegramMessage(newData, newEventID);

      return newEventID;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Enroll a member to an event and return the memberEventID and membershipUpdated status
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
      console.log("[DEBUG] Connecting to database...");

      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set up input parameters
      console.log("[DEBUG] Setting input parameters for stored procedure...");
      request.input("memberID", sql.Int, memberID);
      request.input("eventID", sql.Int, eventID);
      request.input("fullName", sql.NVarChar(100), fullName);
      request.input("age", sql.NVarChar(10), age);
      request.input("schoolName", sql.NVarChar(100), schoolName);
      request.input("interests", sql.NVarChar(200), interests);
      request.input("medicalConditions", sql.NVarChar(500), medicalConditions);
      request.input("lunchOption", sql.NVarChar(100), lunchOption);
      request.input("specifyOther", sql.NVarChar(200), specifyOther);

      // Output parameters to capture the new memberEventID and membershipUpdated status
      request.output("memberEventID", sql.Int);
      request.output("membershipUpdated", sql.Bit);

      console.log(
        "[DEBUG] Executing stored procedure usp_enrollMemberToEvent..."
      );

      // Execute the stored procedure and capture the result
      const result = await request.execute("usp_enrollMemberToEvent");

      // Retrieve the memberEventID and membershipUpdated status from the output parameters
      const memberEventID = result.output.memberEventID;
      const membershipUpdated = result.output.membershipUpdated;

      console.log("[DEBUG] Stored procedure executed successfully. Results:", {
        memberEventID,
        membershipUpdated,
      });

      // Close the connection
      connection.close();

      // Return success response with memberEventID and membershipUpdated status
      return {
        success: true,
        message: "Enrollment successful.",
        memberEventID: memberEventID,
        membershipUpdated: Boolean(membershipUpdated), // Convert Bit to Boolean for easier handling in the frontend
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }

  // Add this function inside the event class
  static async getEventByEventId(eventID) {
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
  static async addFeedback(memberEventID, feedbackData) {
    try {
      console.log("[DEBUG] Connecting to database...");

      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set input parameters for the stored procedure
      console.log("[DEBUG] Setting input parameters...");
      request.input("MemberEventID", sql.Int, memberEventID);
      request.input("Experience", sql.TinyInt, feedbackData.experience);
      request.input("Pace", sql.TinyInt, feedbackData.pace);
      request.input("Liked", sql.NVarChar(500), feedbackData.liked);
      request.input("Disliked", sql.NVarChar(500), feedbackData.disliked);
      request.input(
        "AdditionalComments",
        sql.NVarChar(1000),
        feedbackData.additionalComments
      );

      console.log(
        "[DEBUG] Executing stored procedure usp_AddMemberEventFeedback..."
      );
      // Execute the stored procedure
      const result = await request.execute("usp_AddMemberEventFeedback");

      // Close the connection
      connection.close();

      console.log("[DEBUG] Feedback added successfully.");
      return {
        success: true,
        message: result.recordset[0]?.Message || "Feedback added successfully.",
      };
    } catch (error) {
      console.error("[DEBUG] Database error:", error);
      throw error; // Rethrow error to handle in the controller
    }
  }





  // Fetch events by availableDates
static async getEventByAvailableDates(availableDates) {
  try {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();

    request.input("availableDates", sql.NVarChar(100), availableDates); 
    const result = await request.execute("usp_get_event_by_available_dates");

    const eventList = result.recordset.map(
      (row) =>
        new event(
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
          row.picture,
          row.memberEventID,
          row.fullName,
          row.experience
        )
    );

    console.log(eventList);
    connection.close();

    return [...eventList];
  } catch (error) {
    console.error("Database error:", error);
    throw error; // Rethrow to handle in the controller
  }
  }
  
}

module.exports = event;
