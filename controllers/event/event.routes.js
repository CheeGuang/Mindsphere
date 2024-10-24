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

// ========== Export ==========
// Exporting eventRoutes
module.exports = eventRoutes;
