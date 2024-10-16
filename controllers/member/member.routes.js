// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising MemberController
const MemberController = require("./memberController");

// ========== Set-up ==========
// Initialising memberRoutes
const memberRoutes = express.Router();

// ========== Routes ==========
// Route to create a Google member
memberRoutes.post("/create-google-member", MemberController.createGoogleMember);

// Route to check if email exists
memberRoutes.post(
  "/check-email-and-contact-exists",
  MemberController.checkEmailAndContactExists
);

// Route to update member contact
memberRoutes.put(
  "/update-member-contact",
  MemberController.updateMemberContact
);

// ========== Export ==========
module.exports = memberRoutes;
