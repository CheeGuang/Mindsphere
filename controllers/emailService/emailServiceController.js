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

  static async sendIntelliSphereResultEmail(req, res) {
    try {
      console.log("Request Body:", req.body);  // Inspect req.body here
  
      const { recipientEmail, evaluationResults } = req.body;
  
      if (!recipientEmail || !evaluationResults) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: recipientEmail or intelliSphereResult.",
        });
      }
  
      // Instantiate the email service
      const emailService = new EmailService();
  
      // Send the email with results
      const result = await emailService.sendIntelliSphereResultEmail(
        recipientEmail,
        evaluationResults
      );
  
      res.status(200).json({
        success: true,
        message: "Result email sent successfully",
        result: result,
      });
    } catch (error) {
      console.error(`Error in sendIntelliSphereResultEmail: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to send result email.",
      });
    }
  }
  
  static async sendMembershipEmail(req, res) {
    try {
      // Extract recipient email and verification code from the request body
      const { recipientEmail } = req.body;

      // Instantiate the email service
      const emailService = new EmailService();

      // Send the verification email
      const result = await emailService.sendMembershipEmail(
        recipientEmail
      );

      // Return the success response
      res.status(200).json({
        success: true,
        message: "Membership email sent successfully",
        result: result,
      });
    } catch (error) {
      console.error(`Error in sendMembershipEmail: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to send membership email.",
      });
    }
  }
}

// ========== Export ==========

module.exports = EmailController;
