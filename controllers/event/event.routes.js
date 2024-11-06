// ========== Packages ==========
// Initialising express
const express = require("express");
const multer = require("multer");
const path = require("path");

// ========== Controllers ==========
// Initialising EventController
const EventController = require("./eventController");
const event = require("../../models/event");

// ========== Set-up ==========
// Initialising templateRoutes
const eventRoutes = express.Router();

// ========== Routes ==========
// Route to call the event function to get all events
eventRoutes.get("/get-all-event", EventController.getAllEvent);
// Route to call the event function to get event by event id
eventRoutes.get("/get-event/:eventId", EventController.getEventById);
// Route to update an event
eventRoutes.put("/update-event/:eventId", EventController.updateEvent);
// Route to delete an event
eventRoutes.delete("/delete-event/:eventId", EventController.deleteEventById);
// Route to create an event
eventRoutes.post("/create-event", EventController.createEvent);

// Route to get events by member ID
eventRoutes.get(
  "/get-event-by-member-id/:memberId",
  EventController.getEventByMemberId
);

// Route to upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/img/workshop"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Define the image upload route
eventRoutes.post("/uploadImage", EventController.uploadImage);

// Route to get unique event types
eventRoutes.get("/get-unique-event-types", EventController.getUniqueEventTypes);

// Route to enroll a member to an event
eventRoutes.post(
  "/enroll-member-to-event",
  EventController.enrollMemberToEvent
);

// Route for SSE endpoint to listen for QR code scans
eventRoutes.get("/qr-scan-sse", EventController.qrScanSSE);

// Route to trigger the QR scan event (for testing or actual QR scan)
eventRoutes.post("/trigger-qr-scan", EventController.triggerQRScan);

// Add this route inside eventRoutes
eventRoutes.get("/get-event-by-id/:eventId", EventController.getEventByEventId);

// New route to generate PDF and send payment confirmation email
eventRoutes.post("/send-invoice-email", EventController.sendInvoiceEmail);

// ========== Export ==========
// Exporting eventRoutes
module.exports = eventRoutes;
