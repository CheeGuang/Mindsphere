// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising TemplateController
const TemplateController = require("./templateController");

// ========== Set-up ==========
// Initialising templateRoutes
const templateRoutes = express.Router();

// ========== Routes ==========
// Define routes for the Template model
// Route to call the template function
templateRoutes.get("/template-function", TemplateController.templateFunction);

// ========== Export ==========
module.exports = templateRoutes;
