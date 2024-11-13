// ========== Packages ==========
require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
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

    const emailHeader = `Your Mindsphere Verification Code`
    const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 30px;">

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
        </div>`;
    
    // Define the path to the HTML template file
  const templatePath = './public/mindsphereEmailTemplate.html';

  // Read the HTML file
  fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
    if (err) {
      console.error('Error reading the HTML file:', err);
      return;
    }

    // Replace placeholders with dynamic content
    htmlContent = htmlContent.replace('{{header}}', emailHeader);
    htmlContent = htmlContent.replace('{{body}}', emailBody);

    // Define email options
    const mailOptions = {
      from: {
        address: process.env.SMTPUser,
        name: "Mindsphere",
      },
      to: recipientEmail,
      subject: "Your Mindsphere Verification Code",
      html: htmlContent, // Use the modified HTML content
    };

    // Send the email
    try {
      this.transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.error('Error sending email:', error);
          throw new Error('Failed to send verification email');
        } else {
          console.log('Email sent:', result);
        }
      });
    } catch (error) {
      console.error('Error during email sending:', error);
    }
  });
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
      Key: pdfKey,
    };

    const command = new GetObjectCommand(getObjectParams);
    const data = await s3Client.send(command);

    // Read the file stream into a buffer
    const chunks = [];
    for await (const chunk of data.Body) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    const emailHeader = `Payment Confirmation from Mindsphere`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <!-- Workshop and participant details here -->
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
      </div>`;

    const templatePath = './public/mindsphereEmailTemplate.html';

    // Read the HTML template file and replace placeholders
    fs.readFile(templatePath, 'utf8', async (err, htmlContent) => {
      if (err) {
        console.error('Error reading the HTML file:', err);
        throw new Error('Failed to read email template');
      }

      // Replace placeholders with dynamic content
      htmlContent = htmlContent.replace('{{header}}', emailHeader);
      htmlContent = htmlContent.replace('{{body}}', emailBody);

      // Define email options
      const mailOptions = {
        from: {
          address: process.env.SMTPUser,
          name: "Mindsphere",
        },
        to: recipientEmail,
        subject: "You Are All Set! Payment Confirmation from Mindsphere",
        html: htmlContent,
        attachments: [
          {
            filename: "Invoice.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      try {
        // Send the email
        const result = await this.transporter.sendMail(mailOptions);
        console.log(`[DEBUG] Email sent successfully to: ${recipientEmail}`);
        return result;
      } catch (error) {
        console.error("[DEBUG] Error sending email:", error);
        throw new Error("Failed to send payment confirmation email");
      }
    });
  } catch (error) {
    console.error("[DEBUG] Error sending email:", error);
    throw new Error("Failed to send payment confirmation email");
  }
}

  async sendIntelliSphereResultEmail(recipientEmail, evaluationResults) {

    // Log the received object to verify its structure
    console.log("Received evaluation results:", evaluationResults);

    // Ensure required properties are defined
    const overallScore = evaluationResults.overallScore ?? 0;
    const fluencyScore = evaluationResults.fluencyScore ?? 0;
    const grammarScore = evaluationResults.grammarScore ?? 0;
    const lexicalScore = evaluationResults.lexicalScore ?? 0;
    const engagementScore = evaluationResults.engagementScore ?? 0;
    const pointsWentWell = evaluationResults.pointsWentWell || [];
    const pointsDidNotGoWell = evaluationResults.pointsDidNotGoWell || [];
    const improvementActions = evaluationResults.improvementActions || [];

    // Define the dynamic content to replace placeholders
    const emailHeader = `Your IntelliSphere Assessment Results`;
    const emailBody = `
      <div>
        <p>Thank you for using Mindsphere! Below are the results of your IntelliSphere assessment:</p>
        <div style="background-color: #e0f7f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="font-size: 18px; color: #333;">Overall Score: ${overallScore} / 100</h2>
          <div style="width: 100%; background-color: #ddd; border-radius: 5px; margin: 10px 0;">
            <div style="width: ${overallScore}%; height: 20px; background-color: #007bff; border-radius: 5px; text-align: center; color: white;">
              ${overallScore}%
            </div>
          </div>
        </div>

        <h3 style="font-size: 16px; color: #333;">Detailed Scores:</h3>
        <ul>
          <li>Fluency: ${fluencyScore} / 5</li>
          <li>Grammar: ${grammarScore} / 5</li>
          <li>Lexical: ${lexicalScore} / 5</li>
          <li>Engagement: ${engagementScore} / 5</li>
        </ul>

        ${pointsWentWell.length ? `
          <h3 style="font-size: 16px; color: #333;">What Went Well:</h3>
          <ul>
            ${pointsWentWell.map(point => `<li>${point}</li>`).join('')}
          </ul>
        ` : ''}

        ${pointsDidNotGoWell.length ? `
          <h3 style="font-size: 16px; color: #333;">What Did Not Go Well:</h3>
          <ul>
            ${pointsDidNotGoWell.map(point => `<li>${point}</li>`).join('')}
          </ul>
        ` : ''}

        ${improvementActions.length ? `
          <h3 style="font-size: 16px; color: #333;">Steps Moving Forward:</h3>
          <ul>
            ${improvementActions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        ` : ''}

        <p style="font-size: 16px; text-align: center;">
          If you have any questions or need assistance, feel free to contact us at 
          <a href="mailto:mindsphere.services@gmail.com" style="color: #007bff; text-decoration: none;">mindsphere.services@gmail.com</a>.
        </p>
        <p style="font-size: 14px; color: #888; text-align: center;">
          Best regards,<br />The Mindsphere Team
        </p>
      </div>
    `;

    // Define the path to the HTML template file
    const templatePath = './public/mindsphereEmailTemplate.html';

    // Read the HTML file
    fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
      if (err) {
        console.error('Error reading the HTML file:', err);
        return;
      }

      // Replace placeholders with dynamic content
      htmlContent = htmlContent.replace('{{header}}', emailHeader);
      htmlContent = htmlContent.replace('{{body}}', emailBody);

      // Define email options
      const mailOptions = {
        from: {
          address: process.env.SMTPUser,
          name: "Mindsphere",
        },
        to: recipientEmail,
        subject: "Your IntelliSphere Assessment Results",
        html: htmlContent, // Use the modified HTML content
      };

      // Send the email
      try {
        this.transporter.sendMail(mailOptions, (error, result) => {
          if (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send result email');
          } else {
            console.log('Email sent:', result);
          }
        });
      } catch (error) {
        console.error('Error during email sending:', error);
      }
    });
}

  // Function to send the welcome email to the user when they are added to Mind+ membership
async sendMembershipEmail(recipientEmail) {

  const emailHeader = `Welcome to Mind+ Membership`;
  const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 30px;">
          
          <!-- Mindsphere Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://mindsphere.onrender.com/img/logo/mindsphere-logo.png" alt="Mindsphere Logo" style="max-width: 150px;" />
          </div>
      
          <!-- Email Content -->
          <h1 style="color: #333; text-align: center;">Welcome to Mind+ Membership!</h1>
          <p style="font-size: 16px; text-align: center;">
            Congratulations! You are now officially a member of the Mind+ community. We are excited to have you on board and look forward to offering you exclusive benefits.
          </p>
          <div style="background-color: #e0f7f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 18px; color: #333; margin: 0;">You are now part of the Mindsphere family!</p>
          </div>
      
          <!-- Additional Info -->
          <p style="font-size: 16px; text-align: center;">
            As a member, you will enjoy various perks such as early access to new features, special promotions, and more! Stay tuned for further updates.
          </p>

          <!-- Contact Email and Sign Off -->
          <p style="font-size: 16px; text-align: center;">
            If you need any assistance or have any questions, feel free to contact us at <a href="mailto:mindsphere.services@gmail.com" style="color: #007bff; text-decoration: none;">mindsphere.services@gmail.com</a>.
          </p>
          <p style="font-size: 14px; color: #888; text-align: center;">
            Best regards,<br />The Mindsphere Team
          </p>
        </div>
      </div>`;
  

  // Define the path to the HTML template file
  const templatePath = './public/mindsphereEmailTemplate.html';

  // Read the HTML file
  fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
    if (err) {
      console.error('Error reading the HTML file:', err);
      return;
    }

    // Replace placeholders with dynamic content
    htmlContent = htmlContent.replace('{{header}}', emailHeader);
    htmlContent = htmlContent.replace('{{body}}', emailBody);

    // Define email options
    const mailOptions = {
      from: {
        address: process.env.SMTPUser,
        name: "Mindsphere",
      },
      to: recipientEmail,
      subject: "Welcome to Mind+ Membership",
      html: htmlContent, // Use the modified HTML content
    };

    // Send the email
    try {
      this.transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.error('Error sending email:', error);
          throw new Error('Failed to send welcome email');
        } else {
          console.log('Email sent:', result);
        }
      });
    } catch (error) {
      console.error('Error during email sending:', error);
    }
  });
}
}

module.exports = EmailService;
