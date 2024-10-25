// ========== Models ==========
const Event = require("../../models/event");
const express = require("express");
const EventEmitter = require("events");

// Create an instance of EventEmitter for SSE
const qrScanEmitter = new EventEmitter();

// ========== Controller ==========
class EventController {
  // Event function handler to get all events
  static getAllEvent = async (req, res) => {
    try {
      const events = await Event.getAllEvent();
      res.json(events);
    } catch (error) {
      console.error("Error retrieving events:", error.message);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get events by member ID
  static getEventByMemberId = async (req, res) => {
    const memberID = req.params.memberId; // Use console.log here to debug
    console.log("Received memberID:", memberID);

    try {
      const events = await Event.getEventByMemberId(memberID);
      if (events.length > 0) {
        res.json(events);
      } else {
        res.status(404).json({ message: "No events found for this member" });
      }
    } catch (error) {
      console.error("Error retrieving events by member ID:", error);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get unique event types with pictures
  static getUniqueEventTypes = async (req, res) => {
    try {
      const uniqueEventTypes = await Event.getUniqueEventTypes(); // Fetch event types and pictures
      res.json(uniqueEventTypes);
    } catch (error) {
      console.error("Error retrieving unique event types:", error.message);
      res.status(500).send("Error retrieving unique event types");
    }
  };

  // Event function handler to enroll a member to an event using GET parameters
  static enrollMemberToEvent = async (req, res) => {
    // Use req.query instead of req.body for GET request parameters
    const {
      memberID,
      eventID,
      fullName,
      age,
      schoolName,
      interests,
      medicalConditions,
      lunchOption,
      specifyOther,
    } = req.query;

    try {
      const response = await Event.enrollMemberToEvent(
        memberID,
        eventID,
        fullName,
        age,
        schoolName,
        interests,
        medicalConditions,
        lunchOption,
        specifyOther
      );

      // If enrollment is successful, respond with success and memberEventID
      res.status(200).json(response);
    } catch (error) {
      console.error("Error enrolling member to event:", error);
      res.status(500).send("Error enrolling member to event");
    }
  };

  // SSE endpoint to notify when QR code is scanned
  static qrScanSSE = (req, res) => {
    const { memberID, eventID } = req.query;
    console.log(
      "[DEBUG] SSE connection requested with memberID:",
      memberID,
      "and eventID:",
      eventID
    );

    // Check if memberID or eventID is missing in the query
    if (!memberID || !eventID) {
      console.error(
        "[DEBUG] SSE request missing memberID or eventID. Cannot establish connection."
      );
      res.status(400).json({
        error: "memberID and eventID are required in the query parameters.",
      });
      return;
    }

    console.log(
      "[DEBUG] SSE connection established for memberID:",
      memberID,
      "and eventID:",
      eventID
    );

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Listener for the 'qrScan' event
    const sendQRScanUpdate = (data) => {
      console.log(
        "[DEBUG] QR scan event received in SSE listener. Data:",
        data
      );

      // Debugging type and value of memberID and eventID
      console.log(
        `[DEBUG] Comparing data.memberID: ${
          data.memberID
        } (type: ${typeof data.memberID}) with memberID: ${memberID} (type: ${typeof memberID})`
      );
      console.log(
        `[DEBUG] Comparing data.eventID: ${
          data.eventID
        } (type: ${typeof data.eventID}) with eventID: ${eventID} (type: ${typeof eventID})`
      );

      // Convert both `data.memberID` and `data.eventID` to strings for consistent comparison
      const receivedMemberID = String(data.memberID);
      const receivedEventID = String(data.eventID);
      const queryMemberID = String(memberID);
      const queryEventID = String(eventID);

      // Debugging the converted values
      console.log(
        `[DEBUG] After conversion - receivedMemberID: ${receivedMemberID}, queryMemberID: ${queryMemberID}`
      );
      console.log(
        `[DEBUG] After conversion - receivedEventID: ${receivedEventID}, queryEventID: ${queryEventID}`
      );

      if (
        receivedMemberID === queryMemberID &&
        receivedEventID === queryEventID
      ) {
        console.log(
          "[DEBUG] Match found for memberID and eventID. Sending SSE..."
        );
        res.write(`event: qrScan\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } else {
        console.log("[DEBUG] No match for SSE conditions. Ignoring event.");
      }
    };

    // Listen for QR scan event
    qrScanEmitter.on("qrScan", sendQRScanUpdate);

    // Remove listener when the connection is closed
    req.on("close", () => {
      console.log(
        "[DEBUG] SSE connection closed for memberID:",
        memberID,
        "and eventID:",
        eventID
      );
      qrScanEmitter.removeListener("qrScan", sendQRScanUpdate);
    });
  };

  // Endpoint to trigger the QR scan event
  static triggerQRScan = (req, res) => {
    const { memberID, eventID, memberEventID } = req.body;

    if (!memberID || !eventID || !memberEventID) {
      console.error(
        "[DEBUG] Missing memberID, eventID, or memberEventID in triggerQRScan."
      );
      return res
        .status(400)
        .json({ error: "memberID, eventID, and memberEventID are required." });
    }

    console.log(
      "[DEBUG] Triggering QR scan event with memberID:",
      memberID,
      "(type:",
      typeof memberID,
      "), eventID:",
      eventID,
      "(type:",
      typeof eventID,
      "), and memberEventID:",
      memberEventID
    );

    // Emit the qrScan event with memberID, eventID, and memberEventID
    qrScanEmitter.emit("qrScan", {
      success: true,
      memberID,
      eventID,
      memberEventID,
    });

    console.log(
      "[DEBUG] QR scan event emitted successfully for memberID:",
      memberID,
      "and eventID:",
      eventID
    );

    res.status(200).json({ message: "QR scan event triggered successfully." });
  };

  // Add this method inside the EventController class
  static getEventById = async (req, res) => {
    const eventID = req.params.eventId; // Retrieve eventID from URL parameter

    try {
      const event = await Event.getEventById(eventID);

      if (event) {
        res.json(event); // Return the event details if found
      } else {
        res.status(404).json({ message: "Event not found" }); // Return 404 if not found
      }
    } catch (error) {
      console.error("Error retrieving event by event ID:", error.message);
      res.status(500).send("Error retrieving event");
    }
  };
}

// ========== Export ==========
module.exports = EventController;
