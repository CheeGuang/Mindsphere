// ========== Models ==========
const Admin = require("../../models/admin");

// ========== Controller ==========
class AdminController {
  // Create a Google admin
  static async createGoogleAdmin(req, res) {
    try {
      const { firstName, lastName, email, profilePicture, availability, bio } =
        req.body;

      // Call the model function to create a Google admin
      const adminID = await Admin.createGoogleAdmin(
        firstName,
        lastName,
        email,
        profilePicture,
        availability, // Include availability
        bio // Include bio
      );

      res.status(201).json({
        success: true,
        message: "Google admin created successfully",
        adminID: adminID,
      });
    } catch (error) {
      console.error(`Error in createGoogleAdmin: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create Google admin.",
      });
    }
  }

  // Check if both email and contact exist
  static async checkEmailAndContactExists(req, res) {
    try {
      const { email } = req.body;

      // Call the model function to check if both email and contact exist
      const result = await Admin.checkEmailAndContactExists(email);

      // Check if the result contains both email and contact existence flags
      if (result.emailExists && result.contactExists) {
        res.status(200).json({
          success: true,
          emailExists: true,
          contactExists: true,
          adminID: result.adminID, // Return adminID if both email and contact exist
        });
      } else if (result.emailExists && !result.contactExists) {
        res.status(200).json({
          success: true,
          emailExists: true,
          contactExists: false,
          adminID: result.adminID, // Return adminID even if contact doesn't exist
        });
      } else {
        res.status(200).json({
          success: true,
          emailExists: false,
          contactExists: false,
          adminID: null, // Return null for adminID if email doesn't exist
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

  // Update admin contact
  static async updateAdminContact(req, res) {
    try {
      const { adminID, contactNo } = req.body;

      // Call the model function to update the contact number
      const message = await Admin.updateAdminContact(adminID, contactNo);

      res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in updateAdminContact: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update admin contact.",
      });
    }
  }

  // Update Google admin
  static async updateGoogleAdmin(req, res) {
    try {
      const { firstName, lastName, email, profilePicture, availability, bio } =
        req.body;

      // Call the model function to update the Google admin
      const adminID = await Admin.updateGoogleAdmin(
        firstName,
        lastName,
        email,
        profilePicture,
        availability, // Include availability
        bio // Include bio
      );

      res.status(200).json({
        success: true,
        message: "Google admin updated successfully",
        adminID: adminID,
      });
    } catch (error) {
      console.error(`Error in updateGoogleAdmin: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update Google admin.",
      });
    }
  }

  // Create a new admin
  static async createAdmin(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        contactNo,
        password,
        availability,
        bio,
      } = req.body;

      // Call the model function to create an admin
      const adminID = await Admin.createAdmin(
        firstName,
        lastName,
        email,
        contactNo,
        password,
        availability, // Include availability
        bio // Include bio
      );

      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        adminID: adminID,
      });
    } catch (error) {
      console.error(`Error in createAdmin: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create admin.",
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
        const verificationResult = await Admin.verifyVerificationCode(
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
        const message = await Admin.sendVerificationCode(email);

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
      const result = await Admin.verifyVerificationCode(
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

  // Login admin by verifying the password
  static async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;

      // Call the model function to login the admin
      const loginResult = await Admin.loginAdmin(email, password);

      if (loginResult.success) {
        res.status(200).json({
          success: true,
          message: loginResult.message,
          adminID: loginResult.adminID, // Return adminID upon successful login
        });
      } else {
        res.status(400).json({
          success: false,
          message: loginResult.message,
        });
      }
    } catch (error) {
      console.error(`Error in loginAdmin: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to log in.",
      });
    }
  }

  // Update admin password
  static async updateAdminPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      // Call the model function to update the password
      const message = await Admin.updateAdminPassword(email, newPassword);

      res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in updateAdminPassword: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update password.",
      });
    }
  }

  // Retrieve admin profile picture by adminID
  static async getAdminProfilePicture(req, res) {
    try {
      const { adminID } = req.body;

      // Call the model function to get the profile picture
      const profilePicture = await Admin.getAdminProfilePicture(adminID);

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
      console.error(`Error in getAdminProfilePicture: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve profile picture.",
      });
    }
  }

  // Retrieve admin details by adminID
  static async getAdminDetailsById(req, res) {
    console.log("Running getAdminDetailsById Controller");
    try {
      const { adminID } = req.params;

      // Call the model function to get admin details
      const adminDetails = await Admin.getAdminDetailsById(adminID);

      if (adminDetails) {
        res.status(200).json({
          success: true,
          data: adminDetails,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Admin not found.",
        });
      }
    } catch (error) {
      console.error(`Error in getAdminDetailsById: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve admin details.",
      });
    }
  }

  // Update admin availability
  static async updateAdminAvailability(req, res) {
    try {
      const { adminID, newAvailability } = req.body;

      // Call the model function to update the admin's availability
      const updateResult = await Admin.updateAdminAvailability(
        adminID,
        newAvailability
      );

      if (updateResult.success) {
        res.status(200).json({
          success: true,
          message: updateResult.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: updateResult.message,
        });
      }
    } catch (error) {
      console.error(`Error in updateAdminAvailability: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to update admin availability.",
      });
    }
  }
}

// ========== Export ==========
module.exports = AdminController;
