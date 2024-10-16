// ========== Models ==========
const Member = require("../../models/member");

// ========== Controller ==========
class MemberController {
  // Create a Google member
  static async createGoogleMember(req, res) {
    try {
      const { firstName, lastName, email, profilePicture } = req.body;

      // Call the model function to create a Google member
      const memberID = await Member.createGoogleMember(
        firstName,
        lastName,
        email,
        profilePicture
      );

      res.status(201).json({
        success: true,
        message: "Google member created successfully",
        memberID: memberID,
      });
    } catch (error) {
      console.error(`Error in createGoogleMember: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create Google member.",
      });
    }
  }

  // Check if both email and contact exist
  static async checkEmailAndContactExists(req, res) {
    try {
      const { email } = req.body;

      // Call the model function to check if both email and contact exist
      const result = await Member.checkEmailAndContactExists(email);

      // Check if the result contains both email and contact existence flags
      if (result.emailExists && result.contactExists) {
        res.status(200).json({
          success: true,
          emailExists: true,
          contactExists: true,
          memberID: result.memberID, // Return memberID if both email and contact exist
        });
      } else if (result.emailExists && !result.contactExists) {
        res.status(200).json({
          success: true,
          emailExists: true,
          contactExists: false,
          message: "Email exists, but contact number is missing.",
        });
      } else {
        res.status(200).json({
          success: true,
          emailExists: false,
          contactExists: false,
          message: "Neither email nor contact exist.",
        });
      }
    } catch (error) {
      console.error(`Error in checkEmailAndContactExists: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to check email and contact existence.",
      });
    }
  }

  // Update member contact
  static async updateMemberContact(req, res) {
    try {
      const { memberID, contactNo } = req.body;

      // Call the model function to update the contact number
      const message = await Member.updateMemberContact(memberID, contactNo);

      res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in updateMemberContact: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update member contact.",
      });
    }
  }
}

// ========== Export ==========
module.exports = MemberController;
