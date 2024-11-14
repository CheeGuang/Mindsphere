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

// Define route for sending intellisphere result email
emailRoutes.post(
  "/send-result-email",
  EmailServiceController.sendIntelliSphereResultEmail
); // POST route for email

// Route to send the welcome email when membership is updated
emailRoutes.post(
  "/send-membership-email",
  EmailServiceController.sendMembershipEmail
);

// Route to send bulk emails
emailRoutes.post("/send-bulk-email", EmailServiceController.sendBulkEmail); // POST route for bulk email

// ========== Export ==========
// Export the email routes
module.exports = emailRoutes;
