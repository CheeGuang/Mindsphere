const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration
const EventEmitter = require("events");
class AppointmentEmitter extends EventEmitter {}
const appointmentEmitter = new AppointmentEmitter();
const PDFDocument = require("pdfkit"); // Import the pdfkit library
const path = require("path");

/**
 * Class representing an Appointment.
 */
class Appointment {
  /**
   * Create an Appointment.
   * @param {number} AppointmentID - The ID of the appointment.
   * @param {number} MemberID - The ID of the member.
   * @param {number} AdminID - The ID of the admin.
   * @param {Date} endDateTime - The end date and time of the appointment.
   * @param {string} ParticipantURL - The URL for the participant's appointment.
   * @param {string} HostRoomURL - The URL for the host's room.
   */
  constructor(
    AppointmentID,
    MemberID,
    AdminID,
    endDateTime,
    ParticipantURL,
    HostRoomURL
  ) {
    this.AppointmentID = AppointmentID; // Assign the appointment ID
    this.MemberID = MemberID; // Assign the member ID
    this.AdminID = AdminID; // Assign the admin ID
    this.endDateTime = endDateTime; // Assign the end date and time
    this.ParticipantURL = ParticipantURL; // Assign the participant URL
    this.HostRoomURL = HostRoomURL; // Assign the host room URL
  }

  /**
   * Get all appointments.
   * @returns {Promise<Appointment[]>} A promise that resolves to an array of Appointment objects.
   */
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
          row.HostRoomURL
        )
    );
  }

  /**
   * Get an appointment by ID.
   * @param {number} AppointmentID - The ID of the appointment.
   * @returns {Promise<Appointment|null>} A promise that resolves to an Appointment object or null if not found.
   */
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
          result.recordset[0].HostRoomURL
        )
      : null;
  }

  /**
   * Create a new appointment.
   * @param {object} newAppointmentData - The data for the new appointment.
   * @param {number} newAppointmentData.MemberID - The ID of the member.
   * @param {number} newAppointmentData.AdminID - The ID of the admin.
   * @param {Date} newAppointmentData.endDateTime - The end date and time of the appointment.
   * @param {string} newAppointmentData.ParticipantURL - The URL for the participant's appointment.
   * @param {string} newAppointmentData.HostRoomURL - The URL for the host's room.
   * @returns {Promise<Appointment>} A promise that resolves to the created Appointment object.
   */
  static async createAppointment(newAppointmentData) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    // SQL query to insert a new appointment and get the generated AppointmentID
    const sqlQuery = `INSERT INTO Appointment (MemberID, AdminID, endDateTime, ParticipantURL, HostRoomURL) VALUES (@MemberID, @AdminID, @endDateTime, @ParticipantURL, @HostRoomURL); SELECT SCOPE_IDENTITY() AS AppointmentID;`;
    const request = connection.request(); // Create a request object
    // Add the input parameters for the query
    request.input("MemberID", newAppointmentData.MemberID);
    request.input("AdminID", newAppointmentData.AdminID);
    request.input("endDateTime", newAppointmentData.endDateTime);
    request.input("ParticipantURL", newAppointmentData.ParticipantURL);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL);
    const result = await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(result.recordset[0].AppointmentID); // Return the newly created appointment by its ID
  }

  /**
   * Update an appointment.
   * @param {number} AppointmentID - The ID of the appointment to update.
   * @param {object} newAppointmentData - The new data for the appointment.
   * @param {number} newAppointmentData.MemberID - The ID of the member (optional).
   * @param {number} newAppointmentData.AdminID - The ID of the admin (optional).
   * @param {Date} newAppointmentData.endDateTime - The end date and time of the appointment (optional).
   * @param {string} newAppointmentData.ParticipantURL - The URL for the participant's appointment (optional).
   * @param {string} newAppointmentData.HostRoomURL - The URL for the host's room (optional).
   * @returns {Promise<Appointment>} A promise that resolves to the updated Appointment object.
   */
  static async updateAppointment(AppointmentID, newAppointmentData) {
    const connection = await sql.connect(dbConfig); // Establish a connection to the database
    // SQL query to update an appointment by its ID
    const sqlQuery = `UPDATE Appointment SET MemberID = @MemberID, AdminID = @AdminID, endDateTime = @endDateTime, ParticipantURL = @ParticipantURL, HostRoomURL = @HostRoomURL WHERE AppointmentID = @AppointmentID`;
    const request = connection.request(); // Create a request object
    // Add the input parameters for the query
    request.input("AppointmentID", AppointmentID);
    request.input("MemberID", newAppointmentData.MemberID || null);
    request.input("AdminID", newAppointmentData.AdminID || null);
    request.input("endDateTime", newAppointmentData.endDateTime || null);
    request.input("ParticipantURL", newAppointmentData.ParticipantURL || null);
    request.input("HostRoomURL", newAppointmentData.HostRoomURL || null);
    await request.query(sqlQuery); // Execute the query
    connection.close(); // Close the database connection
    return this.getAppointmentById(AppointmentID); // Return the updated appointment by its ID
  }
}

module.exports = Appointment;
