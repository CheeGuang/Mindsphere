// ========== Packages ==========
require("dotenv").config();
const nodemailer = require("nodemailer");
// Import necessary modules
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../awsConfig");

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

  async sendPaymentConfirmation(
    recipientEmail,
    pdfKey,
    participantsData,
    eventDetails
  ) {
    console.log(`[DEBUG] Sending email to: ${recipientEmail}`);

    const { title, duration, lunchProvided, availableDates, time, venue } =
      eventDetails;

    // Generate participant information as HTML
    const participantDetails = participantsData
      .map(
        (participant) => `
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${participant.fullName}</td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${participant.age}</td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${participant.schoolName}</td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${participant.interests}</td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${participant.medicalConditions}</td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${participant.lunchOption}</td>
        </tr>
      `
      )
      .join("");

    try {
      // Retrieve the PDF from S3
      if (!pdfKey) {
        throw new Error("PDF S3 Key is not provided.");
      }

      const getObjectParams = {
        Bucket: "mindsphere-s3",
        Key: pdfKey, // Make sure `pdfKey` is correctly set
      };

      const command = new GetObjectCommand(getObjectParams);
      const data = await s3Client.send(command);

      // Read the file stream into a buffer
      const chunks = [];
      for await (const chunk of data.Body) {
        chunks.push(chunk);
      }
      const pdfBuffer = Buffer.concat(chunks);

      const mailOptions = {
        from: {
          address: process.env.SMTPUser,
          name: "Mindsphere",
        },
        to: recipientEmail,
        subject: "You Are All Set! Payment Confirmation from Mindsphere",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://mindsphere.onrender.com/img/logo/mindsphere-logo.png" alt="Mindsphere Logo" style="max-width: 150px;"/>
          </div>
          <h1 style="color: #333; text-align: center;">You're All Set!</h1>
          <p style="font-size: 16px; text-align: center; line-height: 1.5;">
            Thank you for your payment. We’re excited to have you and your participants join our upcoming workshop! Please find the invoice for your recent payment attached below.
          </p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <div style="text-align: left; font-size: 16px;">
            <h2 style="color: #e4c04b; text-align: center; margin-bottom: 10px;">Workshop Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Title</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${title}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Duration</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${duration}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Available Dates</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${availableDates}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Time</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${time}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Venue</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${venue}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Lunch Provided</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${
                  lunchProvided ? "Yes" : "No"
                }</td>
              </tr>
            </table>
            <h2 style="color: #e4c04b; text-align: center; margin-bottom: 10px;">Participant Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #e0e0e0;">
                  <th style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Name</th>
                  <th style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Age</th>
                  <th style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">School</th>
                  <th style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Interests</th>
                  <th style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Medical Conditions</th>
                  <th style="padding: 10px; border: 1px solid #e0e0e0; font-weight: bold;">Lunch Option</th>
                </tr>
              </thead>
              <tbody>
                ${participantDetails}
              </tbody>
            </table>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">
            If you have any questions or need further assistance, feel free to reach out to us at <a href="mailto:mindsphere.services@gmail.com" style="color: #e4c04b;">mindsphere.services@gmail.com</a>.
          </p>
          <p style="font-size: 14px; color: #888; text-align: center;">
            Best regards,<br />The Mindsphere Team
          </p>
        </div>`,
        attachments: [
          {
            filename: "Invoice.pdf",
            content: pdfBuffer, // Use the buffer fetched from S3
            contentType: "application/pdf",
          },
        ],
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`[DEBUG] Email sent successfully to: ${recipientEmail}`);
      return result;
    } catch (error) {
      console.error("[DEBUG] Error sending email:", error);
      throw new Error("Failed to send payment confirmation email");
    }
  }
}

module.exports = EmailService;
