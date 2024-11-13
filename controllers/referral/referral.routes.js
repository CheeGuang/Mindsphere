// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising ReferralController
const ReferralController = require("./referralController");

// ========== Set-up ==========
// Initialising referralRoutes
const referralRoutes = express.Router();

// ========== Routes ==========
// Route to get referral details by memberID
referralRoutes.get(
  "/referral-details/:memberID",
  ReferralController.getDetails
);

// ========== Export ==========
module.exports = referralRoutes;
