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
// Route to call the event function
eventRoutes.get("/get-all-event", EventController.getAllEvent);
eventRoutes.get("/get-event-by-member-id/:memberId", EventController.getEventByMemberId);

// ========== Export ==========
module.exports = eventRoutes;
