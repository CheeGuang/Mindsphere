// ========== Models ==========
const fetch = require("node-fetch");

// Importing Appointment model
const Appointment = require("../../models/appointment");
API_KEY = process.env.WherebyAPIKey;

// ========== Controller ==========
class AppointmentController {
  // Controller to create appointment with start and end time from eventURI
  static async createAppointment(req, res) {
    try {
      const { eventURI, memberID, adminID, calendlyAccessToken } = req.body;

      // Retrieve the start and end time from Calendly using getAppointmentDetails
      const startEndDateTimeResponse =
        await AppointmentController.getAppointmentDetails(
          { body: { eventURI, calendlyAccessToken } },
          {
            status: (code) => ({ json: (data) => data }), // Mock response to capture data
          }
        );

      if (!startEndDateTimeResponse.success) {
        throw new Error(startEndDateTimeResponse.message);
      }

      const { start_time: startDateTime, end_time: endDateTime } =
        startEndDateTimeResponse;

      // Whereby API endpoint and data for creating the meeting
      const apiUrl = "https://api.whereby.dev/v1/meetings";
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
        error: error.message,
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
      return res.status(500).json({
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
      return res.status(500).json({
        message: "Error retrieving appointments",
        error: error.message,
      });
    }
  }

  // Controller to fetch and return only the start and end time in ISO format
  static async getAppointmentDetails(req, res) {
    try {
      const { eventURI, calendlyAccessToken } = req.body; // Retrieve eventURI and calendlyAccessToken from request body

      console.log("Fetching appointment details for Event URI:", eventURI);

      // Make the request to Calendly API using the provided token
      const response = await fetch(eventURI, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${calendlyAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Parse the response data
      const data = await response.json();
      console.log(data);
      const { start_time, end_time } = data.resource;
      console.log(end_time);
      console.log(start_time);

      if (!start_time || !end_time) {
        return res.status(404).json({
          success: false,
          message: "Start and end time not found for the given event.",
        });
      }

      // Return only the start and end time in ISO format
      return res.status(200).json({
        success: true,
        start_time, // ISO format
        end_time, // ISO format
      });
    } catch (error) {
      console.error(
        `Error in AppointmentController.getAppointmentDetails: ${error.message}`
      );
      return res.status(500).json({
        success: false,
        message: "Failed to fetch appointment details.",
        error: error.message,
      });
    }
  }
}

// ========== Export ==========
module.exports = AppointmentController;
