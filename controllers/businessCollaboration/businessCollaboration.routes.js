// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising BusinessCollaborationController
const BusinessCollaborationController = require("./businessCollaborationController");

// ========== Set-up ==========
// Initialising businessCollaborationRoutes
const businessCollaborationRoutes = express.Router();

// ========== Routes ==========
// Route to get business collaborations
// Optional query parameter `collaborationID` can be provided to fetch a specific collaboration
businessCollaborationRoutes.get(
  "/",
  BusinessCollaborationController.getBusinessCollaborations
);

// Route to create a new business collaboration
businessCollaborationRoutes.post(
  "/",
  BusinessCollaborationController.createBusinessCollaboration
);

// ========== Export ==========
// Export the routes for use in the main application
module.exports = businessCollaborationRoutes;
