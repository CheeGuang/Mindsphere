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
          memberID: result.memberID, // Return memberID even if contact doesn't exist
        });
      } else {
        res.status(200).json({
          success: true,
          emailExists: false,
          contactExists: false,
          memberID: null, // Return null for memberID if email doesn't exist
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

  // Update Google member
  static async updateGoogleMember(req, res) {
    try {
      const { firstName, lastName, email, profilePicture } = req.body;

      // Call the model function to update the Google member
      const memberID = await Member.updateGoogleMember(
        firstName,
        lastName,
        email,
        profilePicture
      );

      res.status(200).json({
        success: true,
        message: "Google member updated successfully",
        memberID: memberID,
      });
    } catch (error) {
      console.error(`Error in updateGoogleMember: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update Google member.",
      });
    }
  }

  // Create a new member
  static async createMember(req, res) {
    try {
      const { firstName, lastName, email, contactNo, password } = req.body;

      // Call the model function to create a member
      const memberID = await Member.createMember(
        firstName,
        lastName,
        email,
        contactNo,
        password
      );

      res.status(201).json({
        success: true,
        message: "Member created successfully",
        memberID: memberID,
      });
    } catch (error) {
      console.error(`Error in createMember: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create member.",
      });
    }
  }

  // Send verification code based on email and verification code verification
  static async sendVerificationCode(req, res) {
    try {
      const { email, verificationCode } = req.body;

      // If verificationCode is provided, verify it
      if (verificationCode) {
        // Call the model function to verify the provided verification code
        const verificationResult = await Member.verifyVerificationCode(
          email,
          verificationCode
        );

        // Check if the verification was successful
        if (verificationResult.success) {
          res.status(200).json({
            success: true,
            message: "Verification successful.",
            emailVCTimestamp: verificationResult.emailVCTimestamp,
          });
        } else {
          res.status(400).json({
            success: false,
            message: verificationResult.message,
          });
        }
      } else {
        // If no verificationCode is provided, send a new verification code
        const message = await Member.sendVerificationCode(email);

        res.status(200).json({
          success: true,
          message: message,
        });
      }
    } catch (error) {
      console.error(`Error in sendVerificationCode: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to process the request.",
      });
    }
  }

  // Verify the provided verification code based on email
  static async verifyVerificationCode(req, res) {
    try {
      const { email, verificationCode } = req.body;

      // Call the model function to verify the verification code
      const result = await Member.verifyVerificationCode(
        email,
        verificationCode
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: "Verification code is valid.",
          emailVCTimestamp: result.emailVCTimestamp,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error(`Error in verifyVerificationCode: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to verify verification code.",
      });
    }
  }

  // Login member by verifying the password
  static async loginMember(req, res) {
    try {
      const { email, password } = req.body;

      // Call the model function to login the member
      const loginResult = await Member.loginMember(email, password);

      if (loginResult.success) {
        res.status(200).json({
          success: true,
          message: loginResult.message,
          memberID: loginResult.memberID, // Return memberID upon successful login
        });
      } else {
        res.status(400).json({
          success: false,
          message: loginResult.message,
        });
      }
    } catch (error) {
      console.error(`Error in loginMember: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to log in.",
      });
    }
  }

  // Update member password
  static async updateMemberPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      // Call the model function to update the password
      const message = await Member.updateMemberPassword(email, newPassword);

      res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in updateMemberPassword: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update password.",
      });
    }
  }
}

// ========== Export ==========
module.exports = MemberController;
