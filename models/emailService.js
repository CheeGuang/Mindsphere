// ========== Packages ==========
require("dotenv").config();
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTPService,
      auth: {
        user: process.env.SMTPUser, // Your email address (set in .env)
        pass: process.env.SMTPPassword, // Your email password (set in .env)
      },
    });
  }

  // Function to send the email with a verification code
  async sendVerificationEmail(recipientEmail, verificationCode) {
    // Define email options
    const mailOptions = {
      from: {
        address: process.env.SMTPUser, // sender address from environment variables
        name: "Mindsphere", // Company name
      },
      to: recipientEmail, // recipient's email
      subject: "Your Mindsphere Verification Code", // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 30px;">
            
            <!-- Mindsphere Logo -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://mindsphere.onrender.com/img/logo/mindsphere-logo.png" alt="Mindsphere Logo" style="max-width: 150px;" />
            </div>
        
            <!-- Email Content -->
            <h1 style="color: #333; text-align: center;">You Are Almost There!</h1>
            <p style="font-size: 16px; text-align: center;">
              Only one step left to become a part of Mindsphere's family. Please enter this verification code in the window where you started creating your account.
            </p>
            <div style="background-color: #e0f7f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 36px; font-weight: bold; color: #333; margin: 0;">${verificationCode}</p>
            </div>
        
            <!-- Contact Email and Sign Off -->
            <p style="font-size: 16px; text-align: center;">
              If you need any assistance, feel free to contact us at <a href="mailto:mindsphere.services@gmail.com" style="color: #007bff; text-decoration: none;">mindsphere.services@gmail.com</a>.
            </p>
            <p style="font-size: 14px; color: #888; text-align: center;">
              Best regards,<br />The Mindsphere Team
            </p>
          </div>
        </div>`,
    };

    // Send the email
    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", result);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}

module.exports = EmailService;
