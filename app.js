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

// ========== Set-Up ==========
// Initiating app
const app = express();
const port = 8000;

// Using Static Public
app.use(express.static(path.join(__dirname, "public")));

// Using JSON
app.use(express.json());

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
