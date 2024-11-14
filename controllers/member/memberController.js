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

  // Update member contact and referral code
  static async updateMemberContact(req, res) {
    try {
      // Debug request and response objects
      console.debug("Request object:", req);
      console.debug("Response object:", res);

      // Ensure request body exists
      if (!req.body) {
        console.error("Request body is undefined.");
        return res.status(400).json({
          success: false,
          message: "Request body is missing. Please provide required data.",
        });
      }

      // Destructure properties from req.body
      const { memberID, contactNo, referralCode } = req.body;

      console.debug(
        "Received request to update member contact and referral code."
      );
      console.debug(`Member ID: ${memberID}`);
      console.debug(`Contact Number: ${contactNo}`);
      console.debug(`Referral Code: ${referralCode || "None provided"}`);

      // Validate input
      if (!memberID || !contactNo) {
        console.error("Validation failed: Missing memberID or contactNo.");
        return res.status(400).json({
          success: false,
          message: "Member ID and contact number are required.",
        });
      }

      // Call the model function to update contact and referral code
      const message = await Member.updateMemberContact(
        memberID,
        contactNo,
        referralCode
      );

      console.debug("Database update successful.");
      console.debug(`Update Result: ${message}`);

      return res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in updateMemberContact: ${error.message}`);

      if (error.message === "Invalid referral code. Update aborted.") {
        console.error("Error: Invalid referral code provided.");
        return res.status(400).json({
          success: false,
          message: "Invalid referral code provided.",
        });
      } else {
        console.error(
          "Error: An unexpected error occurred during the update process."
        );
        return res.status(500).json({
          success: false,
          message: "Failed to update member contact.",
        });
      }
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
      const { firstName, lastName, email, contactNo, password, referralCode } =
        req.body;

      // Call the model function to create a member
      const newMemberID = await Member.createMember(
        firstName,
        lastName,
        email,
        contactNo,
        password,
        referralCode // Pass referral code to the model function
      );

      if (newMemberID) {
        // If a new member was created
        res.status(201).json({
          success: true,
          message: "Member created successfully.",
          newMemberID: newMemberID, // Return the newly created member ID
        });
      } else {
        // If the member was updated
        res.status(200).json({
          success: true,
          message: "Member updated successfully.",
        });
      }
    } catch (error) {
      if (error.message === "Invalid referral code. Member creation aborted.") {
        // Handle invalid referral code error specifically
        res.status(400).json({
          success: false,
          message: "Invalid referral code provided.",
        });
      } else {
        console.error(`Error in createMember: ${error.message}`);
        res.status(500).json({
          success: false,
          message: "Failed to create member.",
        });
      }
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

  // Retrieve member profile picture by memberID
  static async getMemberProfilePicture(req, res) {
    try {
      const { memberID } = req.body;

      // Call the model function to get the profile picture
      const profilePicture = await Member.getMemberProfilePicture(memberID);

      if (profilePicture) {
        res.status(200).json({
          success: true,
          profilePicture: profilePicture,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Profile picture not found.",
        });
      }
    } catch (error) {
      console.error(`Error in getMemberProfilePicture: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve profile picture.",
      });
    }
  }

  // Retrieve member details by memberID
  static async getMemberDetailsById(req, res) {
    console.log("Running getMemberDetailsById Controller");
    try {
      const { memberID } = req.params;

      // Call the model function to get member details
      const memberDetails = await Member.getMemberDetailsById(memberID);

      if (memberDetails) {
        res.status(200).json({
          success: true,
          data: memberDetails,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Member not found.",
        });
      }
    } catch (error) {
      console.error(`Error in getMemberDetailsById: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve member details.",
      });
    }
  }

  //  update member info
  static async updateMember(req, res) {
    const { memberID } = req.params;
    const { firstName, lastName, email, contactNo } = req.body;

    try {
      const updatedMemberID = await Member.updateMemberinfo(memberID, {
        firstName,
        lastName,
        email,
        contactNo,
      });

      if (updatedMemberID) {
        return res.status(200).json({
          message: "Member updated successfully",
          memberID: updatedMemberID,
        });
      } else {
        return res.status(404).json({ error: "Member not found" });
      }
    } catch (error) {
      console.error("Error in updateMember controller:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the member" });
    }
  }

  static async deleteMember(req, res) {
    try {
      // Extract memberID from the request params
      const { memberID } = req.params;

      // Call the deleteMember method from the model
      const isDeleted = await Member.deleteMember(memberID);

      // Check the result and respond accordingly
      if (isDeleted) {
        res.status(200).json({ message: "Member deleted successfully." });
      } else {
        res.status(404).json({ message: "Member not found." });
      }
    } catch (error) {
      console.error("Error in deleteMember controller:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the member." });
    }
  }
}

// ========== Export ==========
module.exports = MemberController;
