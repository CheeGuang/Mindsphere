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

// Route to update Google member
memberRoutes.put("/update-google-member", MemberController.updateGoogleMember);

// Route to create a new member
memberRoutes.post("/create-member", MemberController.createMember);

// Route to send verification code
memberRoutes.post(
  "/send-verification-code",
  MemberController.sendVerificationCode
);

// Route to verify the verification code
memberRoutes.post(
  "/verify-verification-code",
  MemberController.verifyVerificationCode
);

// Route to log in a member
memberRoutes.post("/login-member", MemberController.loginMember);

// Route to update member password
memberRoutes.put("/update-password", MemberController.updateMemberPassword);

// Route to retrieve member profile picture by email
memberRoutes.post(
  "/get-member-profile-picture",
  MemberController.getMemberProfilePicture
);

// Route to get member details by memberID
memberRoutes.get(
  "/member-details/:memberID",
  MemberController.getMemberDetailsById
);
// Route to Update member info
memberRoutes.put("/upadte-member/:memberID", MemberController.updateMember);

memberRoutes.delete("/delete-member/:memberID",MemberController.deleteMember)

// ========== Export ==========
module.exports = memberRoutes;
