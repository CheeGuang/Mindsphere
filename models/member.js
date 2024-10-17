const sql = require("mssql");
const dbConfig = require("../dbConfig");
const EmailService = require("./emailService"); // Import EmailService

class Member {
  constructor(memberID, firstName, lastName, email, profilePicture, contactNo) {
    this.memberID = memberID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profilePicture = profilePicture;
    this.contactNo = contactNo;
  }

  // Function to create a Google member using stored procedure
  static async createGoogleMember(
    firstName,
    lastName,
    email,
    profilePicture = null
  ) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("Email", sql.NVarChar(100), email);
      request.input("profilePicture", sql.NVarChar(500), profilePicture);

      const result = await request.execute("usp_create_google_member");

      connection.close();

      // Return the newly created memberID
      return result.recordset[0].memberID;
    } catch (error) {
      console.error("Error creating Google member:", error);
      throw error;
    }
  }

  // Function to check if both email and contact exist using the updated stored procedure
  static async checkEmailAndContactExists(email) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("Email", sql.NVarChar(100), email);

      const result = await request.execute(
        "usp_check_email_and_contact_exists"
      );

      connection.close();

      // Check for the presence of memberID and return accordingly
      if (
        result.recordset[0].EmailExists === 1 &&
        result.recordset[0].ContactExists === 1
      ) {
        return {
          emailExists: true,
          contactExists: true,
          memberID: result.recordset[0].memberID, // Returning memberID when both email and contact exist
        };
      } else if (result.recordset[0].EmailExists === 1) {
        return {
          emailExists: true,
          contactExists: false,
          memberID: result.recordset[0].memberID, // Returning memberID even if contact doesn't exist
        };
      } else {
        return {
          emailExists: false,
          contactExists: false,
          memberID: null, // Email doesn't exist, no memberID returned
        };
      }
    } catch (error) {
      console.error("Error checking email and contact:", error);
      throw error;
    }
  }

  // Function to update a member's contact number using stored procedure
  static async updateMemberContact(memberID, contactNo) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("memberID", sql.Int, memberID);
      request.input("contactNo", sql.NVarChar(20), contactNo);

      const result = await request.execute("usp_update_member_contact");

      connection.close();

      // Return success message from the stored procedure
      return result.recordset[0].Message;
    } catch (error) {
      console.error("Error updating member contact:", error);
      throw error;
    }
  }

  // Function to update Google member using the new stored procedure
  static async updateGoogleMember(
    firstName,
    lastName,
    email,
    profilePicture = null
  ) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("Email", sql.NVarChar(100), email);
      request.input("profilePicture", sql.NVarChar(500), profilePicture);

      const result = await request.execute("usp_update_google_member");

      connection.close();

      // Return the updated memberID if successful
      return result.recordset[0].newMemberID;
    } catch (error) {
      console.error("Error updating Google member:", error);
      throw error;
    }
  }

  // Function to create a member using stored procedure
  static async createMember(firstName, lastName, email, contactNo, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("email", sql.NVarChar(100), email);
      request.input("contactNo", sql.NVarChar(20), contactNo);
      request.input("password", sql.NVarChar(100), password);

      const result = await request.execute("usp_create_member");

      connection.close();

      // Return the newly created memberID
      return result.recordset[0].newMemberID;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  }

  // Function to send verification code based on email
  static async sendVerificationCode(email) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Update the verification code in the database based on email
      request.input("email", sql.NVarChar(100), email);
      request.input("newEmailVC", sql.NVarChar(100), verificationCode);
      await request.execute("usp_update_or_create_member_by_email");

      connection.close();

      // Send the email using EmailService
      const emailService = new EmailService();
      await emailService.sendVerificationEmail(email, verificationCode);

      // Return a success message
      return `Verification code sent to ${email}`;
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw error;
    }
  }
}

module.exports = Member;
