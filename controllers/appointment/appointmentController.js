// ========== Models ==========
// Importing Appointment model
const { Appointment } = require("../../models/appointment");

// ========== Controller ==========
class AppointmentController {
  /**
   * Controller to create a new appointment.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async createAppointment(req, res) {
    try {
      const apiUrl = "https://api.whereby.dev/v1/meetings";
      const { endDate, ParticipantURL, MemberID, AdminID } = req.body;

      // Parsing the end date to a moment object
      const endDateTime = moment.tz(endDate, "Asia/Singapore");

      // Ensure that End Date Time of meeting is no earlier than 59 minutes from now
      const oneHourFromNow = moment().tz("Asia/Singapore").add(59, "minutes");
      if (endDateTime.isBefore(oneHourFromNow)) {
        throw new Error("End time must be at least 1 hour away from now.");
      }

      // Ensure that End Date Time of meeting is within one week from now
      const oneWeekFromNow = moment().tz("Asia/Singapore").add(7, "days");
      if (endDateTime.isAfter(oneWeekFromNow)) {
        throw new Error("End time must be within 1 week from now.");
      }

      // Request data for creating appointment
      const requestData = {
        endDate: endDateTime.utc().format(), // Using converted end date time in UTC format
        fields: ["hostRoomUrl"],
      };

      // Making POST request to Whereby API
      function getResponse() {
        return fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      }

      // Fetch the response from the API
      const roomData = await getResponse().then(async (res) => {
        const data = await res.json();
        return data;
      });

      // Ensure that room is created
      if (!roomData.roomUrl || !roomData.hostRoomUrl)
        throw new Error("Unable to create Room.");

      // Post room data into Appointment Table in SQL Database
      const newAppointmentData = {
        MemberID: MemberID,
        AdminID: AdminID,
        endDateTime: endDateTime.toISOString(),
        ParticipantURL: roomData.roomUrl,
        HostRoomURL: roomData.hostRoomUrl,
      };

      try {
        const createdAppointment = await Appointment.createAppointment(
          newAppointmentData
        );

        // Handling Response
        res.status(200).json({
          success: true,
          message: "Appointment added successfully",
          roomURL: createdAppointment.ParticipantURL,
          hostRoomUrl: createdAppointment.HostRoomURL,
        });
      } catch (error) {
        console.error("Error saving appointment to database:", error);
        res.status(500).send("Error creating appointment in the database");
      }
    } catch (error) {
      console.error(`Error in createAppointment: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create appointment.",
      });
    }
  }

  /**
   * Controller to get all appointments.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.getAllAppointments();
      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error(`Error in getAllAppointments: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve appointments.",
      });
    }
  }

  /**
   * Controller to get an appointment by ID.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async getAppointmentById(req, res) {
    const { id } = req.params;
    try {
      const appointment = await Appointment.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found.",
        });
      }
      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      console.error(`Error in getAppointmentById: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve appointment.",
      });
    }
  }

  /**
   * Controller to update an appointment.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async updateAppointment(req, res) {
    const { id } = req.params;
    const newAppointmentData = req.body;

    try {
      const updatedAppointment = await Appointment.updateAppointment(
        id,
        newAppointmentData
      );
      if (!updatedAppointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found.",
        });
      }
      res.status(200).json({
        success: true,
        data: updatedAppointment,
      });
    } catch (error) {
      console.error(`Error in updateAppointment: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update appointment.",
      });
    }
  }
}

// ========== Export ==========
module.exports = AppointmentController;
