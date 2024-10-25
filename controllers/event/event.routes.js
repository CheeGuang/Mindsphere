// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising EventController
const EventController = require("./eventController");

// ========== Set-up ==========
// Initialising templateRoutes
const eventRoutes = express.Router();

// ========== Routes ==========
// Route to call the event function to get all events
eventRoutes.get("/get-all-event", EventController.getAllEvent);

// Route to get events by member ID
eventRoutes.get(
  "/get-event-by-member-id/:memberId",
  EventController.getEventByMemberId
);

// Route to get unique event types
eventRoutes.get("/get-unique-event-types", EventController.getUniqueEventTypes);

// Route to enroll a member to an event
eventRoutes.get("/enroll-member-to-event", EventController.enrollMemberToEvent);

// Route for SSE endpoint to listen for QR code scans
eventRoutes.get("/qr-scan-sse", EventController.qrScanSSE);

// Route to trigger the QR scan event (for testing or actual QR scan)
eventRoutes.post("/trigger-qr-scan", EventController.triggerQRScan);

// Add this route inside eventRoutes
eventRoutes.get("/get-event-by-id/:eventId", EventController.getEventById);

// ========== Export ==========
// Exporting eventRoutes
module.exports = eventRoutes;
