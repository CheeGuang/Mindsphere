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

// Route to get children by memberID
childRoutes.get("/:memberID", ChildController.getChildByMemberID);

// ========== Export ==========
module.exports = childRoutes;
