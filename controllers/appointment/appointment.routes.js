// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising AppointmentController
const AppointmentController = require("./appointmentController");

// ========== Set-up ==========
// Initialising appointmentRoutes
const appointmentRoutes = express.Router();

// ========== Routes ==========
// Route to create a new appointment
appointmentRoutes.post(
  "/create-appointment",
  AppointmentController.createAppointment
);

// Route to get all appointments by MemberID
appointmentRoutes.get(
  "/member/:memberID",
  AppointmentController.getAllAppointmentsByMemberID
);

// Route to get all appointments by AdminID
appointmentRoutes.get(
  "/admin/:adminID",
  AppointmentController.getAllAppointmentsByAdminID
);

// ========== Export ==========
// Exporting appointmentRoutes
module.exports = appointmentRoutes;
