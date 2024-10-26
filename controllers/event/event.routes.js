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
// Route to call the event function to get event by event id
eventRoutes.get("/get-event/:eventId", EventController.getEventById);
// Route to update an event
eventRoutes.put("/update-event/:eventId", EventController.updateEvent);
// Route to delete an event
eventRoutes.delete("/delete-event/:eventId", EventController.deleteEventById);

// Route to get events by member ID
eventRoutes.get(
  "/get-event-by-member-id/:memberId",
  EventController.getEventByMemberId
);

// Route to get unique event types
eventRoutes.get("/get-unique-event-types", EventController.getUniqueEventTypes);

// ========== Export ==========
// Exporting eventRoutes
module.exports = eventRoutes;
