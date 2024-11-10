// ========== Packages ==========
// Initialising dotenv
require("dotenv").config();
// Initialising express
const express = require("express");
// Initialising path
const path = require("path");
// Initialising template Routes
const templateRoutes = require("./controllers/template/template.routes");
// Initialising member Routes
const memberRoutes = require("./controllers/member/member.routes");
// Initialising event Routes
const eventRoutes = require("./controllers/event/event.routes");
// Initialising admin Routes
const adminRoutes = require("./controllers/admin/admin.routes");
// Initialising appointment Routes
const appointmentRoutes = require("./controllers/appointment/appointment.routes");
// Initialising intelliSphere Routes
const intelliSphereRoutes = require("./controllers/intelliSphere/intelliSphere.routes");
// Initialising dashboard Routes
const dashboardRoutes = require("./controllers/dashboard/dashboard.routes");

// ========== Set-Up ==========
// Initiating app
const app = express();
const port = 8000;

// Using Static Public
app.use(express.static(path.join(__dirname, "public")));

// Using JSON with increased limit
app.use(express.json({ limit: "100mb" })); // Increase the limit as needed

// Using URL-encoded with increased limit
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Return index.html at default endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "public", "index.html"));
});

// ========== Routes ==========
// Template Route
app.use("/api/template", templateRoutes);

// Member Route
app.use("/api/member", memberRoutes);

// Event Route
app.use("/api/event", eventRoutes);

// Admin Route
app.use("/api/admin", adminRoutes);

// Appointment Route
app.use("/api/appointment", appointmentRoutes);

// IntelliSphere Route
app.use("/api/intelliSphere", intelliSphereRoutes);

// Dashboard Route
app.use("/api/dashboard", dashboardRoutes);

// ========== Initialise Server ==========
// Server Listening at port 8000
app.listen(port, async () => {
  console.log(`Server successfully running on http://localhost:${port}`);
  console.log("Press CTRL+C to stop the server.");
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
