// ========== Models ==========
// Importing Appointment model
const Appointment = require("../../models/appointment");
API_KEY = process.env.WherebyAPIKey;

// ========== Controller ==========
class AppointmentController {
  static async createAppointment(req, res) {
    try {
      const apiUrl = "https://api.whereby.dev/v1/meetings";
      const {
        startDateTime,
        endDateTime,
        memberID,
        adminID,
        requestDescription,
      } = req.body;

      // Data for creating the meeting in Whereby
      const requestData = {
        endDate: endDateTime,
        fields: ["hostRoomUrl"],
      };

      // Function to handle the Whereby API request
      const getResponse = () => {
        return fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      };

      // Make the request and retrieve room data
      const roomData = await getResponse().then(async (res) => {
        const data = await res.json();
        return data;
      });

      // Verify room creation
      if (!roomData.roomUrl || !roomData.hostRoomUrl) {
        throw new Error("Unable to create Room.");
      }

      // New appointment data to save in the SQL database
      const newAppointmentData = {
        MemberID: memberID,
        AdminID: adminID,
        startDateTime,
        endDateTime,
        ParticipantURL: roomData.roomUrl,
        HostRoomURL: roomData.hostRoomUrl,
        requestDescription,
      };

      console.log(newAppointmentData);

      // Attempt to create the appointment in the database
      const createdAppointment = await Appointment.createAppointment(
        newAppointmentData
      );

      // Send successful response
      res.status(200).json({
        success: true,
        message: "Appointment added successfully",
        roomURL: createdAppointment.ParticipantURL,
        hostRoomUrl: createdAppointment.HostRoomURL,
      });
    } catch (error) {
      console.error(`Error in createAppointment: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create appointment.",
      });
    }
  }
  // Controller to get all appointments by MemberID
  static async getAllAppointmentsByMemberID(req, res) {
    try {
      const memberID = req.params.memberID; // Get MemberID from request parameters
      console.log(
        "Received request to get all appointments for MemberID:",
        memberID
      );

      const appointments = await Appointment.getAllAppointmentsByMemberID(
        memberID
      );

      if (appointments.message) {
        // If no appointments found, send a 404 response with a message
        return res.status(404).json({ message: appointments.message });
      }

      // Send a 200 response with the retrieved appointments
      return res.status(200).json({ appointments });
    } catch (error) {
      console.error(
        `Error in AppointmentController.getAllAppointmentsByMemberID: ${error.message}`
      );
      return res
        .status(500)
        .json({
          message: "Error retrieving appointments",
          error: error.message,
        });
    }
  }

  // Controller to get all appointments by AdminID
  static async getAllAppointmentsByAdminID(req, res) {
    try {
      const adminID = req.params.adminID; // Get AdminID from request parameters
      console.log(
        "Received request to get all appointments for AdminID:",
        adminID
      );

      const appointments = await Appointment.getAllAppointmentsByAdminID(
        adminID
      );

      if (appointments.message) {
        // If no appointments found, send a 404 response with a message
        return res.status(404).json({ message: appointments.message });
      }

      // Send a 200 response with the retrieved appointments
      return res.status(200).json({ appointments });
    } catch (error) {
      console.error(
        `Error in AppointmentController.getAllAppointmentsByAdminID: ${error.message}`
      );
      return res
        .status(500)
        .json({
          message: "Error retrieving appointments",
          error: error.message,
        });
    }
  }
}

// ========== Export ==========
module.exports = AppointmentController;
