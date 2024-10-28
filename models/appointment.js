const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Appointment {
  constructor(
    AppointmentID,
    MemberID,
    AdminID,
    endDateTime,
    startDateTime,
    ParticipantURL,
    HostRoomURL,
    requestDescription // New attribute for request description
  ) {
    this.AppointmentID = AppointmentID; // Assign the appointment ID
    this.MemberID = MemberID; // Assign the member ID
    this.AdminID = AdminID; // Assign the admin ID
    this.endDateTime = endDateTime; // Assign the end date and time
    this.startDateTime = startDateTime; // Assign the end date and time
    this.ParticipantURL = ParticipantURL; // Assign the participant URL
    this.HostRoomURL = HostRoomURL; // Assign the host room URL
    this.requestDescription = requestDescription; // Assign the request description
  }
  static async createAppointment(data) {
    let pool; // Define pool outside the try block to access it in finally
    try {
      console.log("Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("Database connected.");

      console.log("Executing stored procedure with input data:", data);

      const result = await pool
        .request()
        .input("MemberID", sql.Int, data.MemberID)
        .input("AdminID", sql.Int, data.AdminID)
        .input("startDateTime", sql.NVarChar(40), data.startDateTime)
        .input("endDateTime", sql.NVarChar(40), data.endDateTime)
        .input("ParticipantURL", sql.NVarChar(1000), data.ParticipantURL)
        .input("HostRoomURL", sql.NVarChar(1000), data.HostRoomURL)
        .input(
          "requestDescription",
          sql.NVarChar(1000),
          data.requestDescription
        )
        .execute("usp_create_appointment"); // Execute the stored procedure

      console.log("Stored procedure executed successfully.");
      console.log("Result:", result);

      // Check if rows were affected as an indication of success
      if (result.rowsAffected[0] > 0) {
        console.log("Appointment created successfully.");
        return { message: "Appointment created successfully." };
      } else {
        console.warn("No rows affected. The appointment was not created.");
        return {
          message: "No rows affected. The appointment was not created.",
        };
      }
    } catch (error) {
      console.error(`Error in Appointment.createAppointment: ${error.message}`);
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("Database connection closed.");
      }
    }
  }
  // Function to get all appointments by MemberID
  static async getAllAppointmentsByMemberID(memberID) {
    let pool;
    try {
      console.log("Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("Database connected.");

      console.log("Executing stored procedure with input MemberID:", memberID);

      const result = await pool
        .request()
        .input("MemberID", sql.Int, memberID) // Input parameter for MemberID
        .execute("usp_get_all_appointments_by_memberID"); // Execute the stored procedure

      console.log("Stored procedure executed successfully.");
      console.log("Result:", result);

      // Check if any rows were returned
      if (result.recordset.length > 0) {
        console.log("Appointments retrieved successfully.");
        return result.recordset; // Return the list of appointments
      } else {
        console.warn("No appointments found for the given MemberID.");
        return { message: "No appointments found for the given MemberID." };
      }
    } catch (error) {
      console.error(
        `Error in Appointment.getAllAppointmentsByMemberID: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("Database connection closed.");
      }
    }
  }

  // Function to get all appointments by AdminID
  static async getAllAppointmentsByAdminID(adminID) {
    let pool;
    try {
      console.log("Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("Database connected.");

      console.log("Executing stored procedure with input AdminID:", adminID);

      const result = await pool
        .request()
        .input("AdminID", sql.Int, adminID) // Input parameter for AdminID
        .execute("usp_get_all_appointments_by_adminID"); // Execute the stored procedure

      console.log("Stored procedure executed successfully.");
      console.log("Result:", result);

      // Check if any rows were returned
      if (result.recordset.length > 0) {
        console.log("Appointments retrieved successfully.");
        return result.recordset; // Return the list of appointments
      } else {
        console.warn("No appointments found for the given AdminID.");
        return { message: "No appointments found for the given AdminID." };
      }
    } catch (error) {
      console.error(
        `Error in Appointment.getAllAppointmentsByAdminID: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("Database connection closed.");
      }
    }
  }
}

module.exports = Appointment;
