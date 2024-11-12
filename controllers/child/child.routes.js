// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising ChildController
const ChildController = require("./childController");

// ========== Set-up ==========
// Initialising childRoutes
const childRoutes = express.Router();

// ========== Routes ==========
// Define routes for the Child model
// Route to register a child
childRoutes.post("/register-child", ChildController.registerChild);

// ========== Export ==========
module.exports = childRoutes;
