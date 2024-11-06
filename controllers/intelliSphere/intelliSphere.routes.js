// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising IntelliSphereController
const IntelliSphereController = require("./intelliSphereController");

// ========== Set-up ==========
// Initialising intelliSphereRoutes
const intelliSphereRoutes = express.Router();

// ========== Routes ==========
// Define routes for the IntelliSphere model
// Route to initiate speech assessment
intelliSphereRoutes.post(
  "/assess-speech",
  IntelliSphereController.assessSpeech
);

// ========== Export ==========
module.exports = intelliSphereRoutes;
