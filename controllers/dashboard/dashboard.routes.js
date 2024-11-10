// ========== Packages ==========
const express = require("express"); // Importing express

// ========== Controllers ==========
const DashboardController = require("./dashboardController"); // Importing the DashboardController

// ========== Set-up ==========
const dashboardRoutes = express.Router(); // Initialising dashboardRoutes

// ========== Routes ==========
// Route to get general dashboard data
dashboardRoutes.get("/", DashboardController.getDashboardData);

// Route to get event-specific dashboard data by EventID
dashboardRoutes.get(
  "/event/:eventID",
  DashboardController.getEventDashboardData
);

// ========== Export ==========
// Exporting dashboardRoutes
module.exports = dashboardRoutes;
