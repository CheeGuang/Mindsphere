// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising EmailController
const EmailServiceController = require("./emailServiceController");

// ========== Set-up ==========
// Initialising routes
const emailRoutes = express.Router(); // Routes for email functionalities

// ========== Routes ==========
// Define route for sending verification email
// emailRoutes.post("/send-verification-email", EmailServiceController.sendVerificationEmail); // POST route for email

// ========== Export ==========
// Export the email routes
module.exports = emailRoutes;
