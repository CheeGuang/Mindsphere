const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration
const EventEmitter = require("events");
class AppointmentEmitter extends EventEmitter {}
const appointmentEmitter = new AppointmentEmitter();
const PDFDocument = require("pdfkit"); // Import the pdfkit library
const path = require("path");

class Appointment {
  constructor(
    AppointmentID,
    MemberID,
    AdminID,
    endDateTime,
    ParticipantURL,
    HostRoomURL,
    requestDescription // New attribute for request description
  ) {
    this.AppointmentID = AppointmentID; // Assign the appointment ID
    this.MemberID = MemberID; // Assign the member ID
    this.AdminID = AdminID; // Assign the admin ID
    this.endDateTime = endDateTime; // Assign the end date and time
    this.ParticipantURL = ParticipantURL; // Assign the participant URL
    this.HostRoomURL = HostRoomURL; // Assign the host room URL
    this.requestDescription = requestDescription; // Assign the request description
  }

  static async getAllAppointments() {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment`; // SQL query to select all appointments
    const request = connection.request(); // Create a request object
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

    // Map the results to Appointment objects and return them
    return result.recordset.map(
      (row) =>
        new Appointment(
          row.AppointmentID,
          row.MemberID,
          row.AdminID,
          row.endDateTime,
          row.ParticipantURL,
          row.HostRoomURL,
          row.requestDescription // Include requestDescription
        )
    );
  }

  static async getAppointmentById(AppointmentID) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `SELECT * FROM Appointment WHERE AppointmentID = @AppointmentID`; // SQL query to select an appointment by ID
    const request = connection.request(); // Create a request object
    request.input("AppointmentID", AppointmentID); // Add the input parameter for the query
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection

    // Return the result as an Appointment object if found, otherwise return null
    return result.recordset[0]
      ? new Appointment(
          result.recordset[0].AppointmentID,
          result.recordset[0].MemberID,
          result.recordset[0].AdminID,
          result.recordset[0].endDateTime,
          result.recordset[0].ParticipantURL,
          result.recordset[0].HostRoomURL,
          result.recordset[0].requestDescription // Include requestDescription
        )
      : null;
  }

  static async createAppointment(newAppointmentData) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `INSERT INTO Appointment (MemberID, AdminID, endDateTime, ParticipantURL, HostRoomURL, requestDescription) VALUES (@MemberID, @AdminID, @endDateTime, @ParticipantURL, @HostRoomURL, @requestDescription); SELECT SCOPE_IDENTITY() AS AppointmentID;`; // Updated SQL query to include requestDescription
    const request = connection.request(); // Create a request object
    request.input("MemberID", newAppointmentData.MemberID);
    request.input("AdminID", newAppointmentData.AdminID);
    request.input("endDateTime", newAppointmentData.endDateTime);
    request.input("ParticipantURL", newAppointmentData.ParticipantURL);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL);
    request.input("requestDescription", newAppointmentData.requestDescription); // Add requestDescription input
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(result.recordset[0].AppointmentID); // Return the newly created appointment by its ID
  }

  static async updateAppointment(AppointmentID, newAppointmentData) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    const sqlQuery = `UPDATE Appointment SET MemberID = @MemberID, AdminID = @AdminID, endDateTime = @endDateTime, ParticipantURL = @ParticipantURL, HostRoomURL = @HostRoomURL, requestDescription = @requestDescription WHERE AppointmentID = @AppointmentID`; // Updated SQL query to include requestDescription
    const request = connection.request(); // Create a request object
    request.input("AppointmentID", AppointmentID);
    request.input("MemberID", newAppointmentData.MemberID || null);
    request.input("AdminID", newAppointmentData.AdminID || null);
    request.input("endDateTime", newAppointmentData.endDateTime || null);
    request.input("ParticipantURL", newAppointmentData.ParticipantURL || null);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL || null);
    request.input(
      "requestDescription",
      newAppointmentData.requestDescription || null
    ); // Add requestDescription input
    await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(AppointmentID); // Return the updated appointment by its ID
  }
}

module.exports = Appointment;
