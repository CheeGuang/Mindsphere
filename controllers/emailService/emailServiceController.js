// ========== Models ==========
// Assuming the EmailService model is already created as per your previous code
const EmailService = require("../../models/emailService");

// ========== Controller ==========

class EmailController {
  // Email verification function handler
  static async sendVerificationEmail(req, res) {
    try {
      // Extract recipient email and verification code from the request body
      const { recipientEmail, verificationCode } = req.body;

      // Instantiate the email service
      const emailService = new EmailService();

      // Send the verification email
      const result = await emailService.sendVerificationEmail(
        recipientEmail,
        verificationCode
      );

      // Return the success response
      res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
        result: result,
      });
    } catch (error) {
      console.error(`Error in sendVerificationEmail: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to send verification email.",
      });
    }
  }
}

// ========== Export ==========

module.exports = EmailController;
