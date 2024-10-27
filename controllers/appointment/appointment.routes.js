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

// Route to get all appointments
appointmentRoutes.get(
  "/all-appointments",
  AppointmentController.getAllAppointments
);

// Route to get an appointment by ID
appointmentRoutes.get(
  "/appointment-details/:id",
  AppointmentController.getAppointmentById
);

// Route to update an appointment
appointmentRoutes.put(
  "/update-appointment/:id",
  AppointmentController.updateAppointment
);

// ========== Export ==========
// Exporting appointmentRoutes
module.exports = appointmentRoutes;
