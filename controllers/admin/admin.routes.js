// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising AdminController
const AdminController = require("./adminController");

// ========== Set-up ==========
// Initialising adminRoutes
const adminRoutes = express.Router();

// ========== Routes ==========
// Route to create a Google admin
adminRoutes.post("/create-google-admin", AdminController.createGoogleAdmin);

// Route to check if email exists
adminRoutes.post(
  "/check-email-and-contact-exists",
  AdminController.checkEmailAndContactExists
);

// Route to update admin contact
adminRoutes.put("/update-admin-contact", AdminController.updateAdminContact);

// Route to update Google admin
adminRoutes.put("/update-google-admin", AdminController.updateGoogleAdmin);

// Route to create a new admin
adminRoutes.post("/create-admin", AdminController.createAdmin);

// Route to send verification code
adminRoutes.post(
  "/send-verification-code",
  AdminController.sendVerificationCode
);

// Route to verify the verification code
adminRoutes.post(
  "/verify-verification-code",
  AdminController.verifyVerificationCode
);

// Route to log in an admin
adminRoutes.post("/login-admin", AdminController.loginAdmin);

// Route to update admin password
adminRoutes.put("/update-password", AdminController.updateAdminPassword);

// Route to retrieve admin profile picture by email
adminRoutes.post(
  "/get-admin-profile-picture",
  AdminController.getAdminProfilePicture
);

// Route to get admin details by adminID
adminRoutes.get("/admin-details/:adminID", AdminController.getAdminDetailsById);

// Route to update admin availability
adminRoutes.put(
  "/update-admin-availability",
  AdminController.updateAdminAvailability
);

// Route to get all admins with their profile pictures and bio
adminRoutes.get("/get-all-admins", AdminController.getAllAdmins);

// Route to update admin Calendly link by adminID
adminRoutes.put("/update-calendly-link", AdminController.updateCalendlyLink);

// Route to update admin Calendly access token by adminID
adminRoutes.put(
  "/update-calendly-access-token",
  AdminController.updateCalendlyAccessToken
);

// ========== Export ==========
module.exports = adminRoutes;
