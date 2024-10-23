const sql = require("mssql");
const dbConfig = require("../dbConfig");
const EmailService = require("./emailService"); // Import EmailService
const bcrypt = require("bcrypt"); // Import bcrypt

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

  // Function to create a member using stored procedure with password encryption
  static async createMember(firstName, lastName, email, contactNo, password) {
    try {
      // Hash the password using bcrypt before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("email", sql.NVarChar(100), email);
      request.input("contactNo", sql.NVarChar(20), contactNo);
      request.input("password", sql.NVarChar(100), hashedPassword); // Store hashed password

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

  // Function to verify the provided verification code with emailVC and emailVCTimestamp using stored procedure
  static async verifyVerificationCode(email, verificationCode) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("email", sql.NVarChar(100), email);

      // Execute the stored procedure to get emailVC and emailVCTimestamp
      const result = await request.execute("usp_get_member_email_verification");

      connection.close();

      if (result.recordset.length === 0) {
        return {
          success: false,
          message: "Email not found.",
        };
      }

      const emailVC = result.recordset[0].emailVC;
      const emailVCTimestamp = result.recordset[0].emailVCTimestamp;

      // Check if the provided verification code matches the one stored in the database
      if (emailVC !== verificationCode) {
        return {
          success: false,
          message: "Verification code is incorrect.",
        };
      }

      // Check if the verification code was provided within 1 minute of the timestamp
      const currentTime = new Date();
      const timestamp = new Date(emailVCTimestamp);
      const timeDifference = (currentTime - timestamp) / 1000 / 60; // Convert milliseconds to minutes

      if (timeDifference > 1) {
        return {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        };
      }

      // If all checks pass, return success
      return {
        success: true,
        emailVCTimestamp: emailVCTimestamp,
      };
    } catch (error) {
      console.error("Error verifying verification code:", error);
      throw error;
    }
  }

  // Function to login a member by comparing the stored password with the provided password
  static async loginMember(email, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Retrieve the member's hashed password from the database
      request.input("email", sql.NVarChar(100), email);
      const passwordResult = await request.execute(
        "usp_get_member_password_by_email"
      );

      // If no member is found with the provided email
      if (passwordResult.recordset.length === 0) {
        connection.close();
        return {
          success: false,
          message: "Invalid email or password.",
        };
      }

      const hashedPassword = passwordResult.recordset[0].password;

      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        connection.close();
        return {
          success: false,
          message: "Invalid email or password.",
        };
      }

      // If password matches, retrieve the memberID
      const memberIDRequest = connection.request();
      memberIDRequest.input("email", sql.NVarChar(100), email);
      const memberIDResult = await memberIDRequest.execute(
        "usp_get_member_id_by_email"
      );

      connection.close();

      // Return success with the memberID
      return {
        success: true,
        message: "Login successful.",
        memberID: memberIDResult.recordset[0].memberID, // Return memberID upon successful login
      };
    } catch (error) {
      console.error("Error logging in member:", error);
      throw error;
    }
  }

  // Function to update a member's password using stored procedure
  static async updateMemberPassword(email, newPassword) {
    try {
      // Hash the new password using bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the inputs for the stored procedure
      request.input("email", sql.NVarChar(100), email);
      request.input("newPassword", sql.NVarChar(100), hashedPassword); // Store hashed password

      // Execute the stored procedure to update the password
      const result = await request.execute("usp_update_password_by_email");

      connection.close();

      // Return the result message from the stored procedure
      return result.recordset[0].Message;
    } catch (error) {
      console.error("Error updating member password:", error);
      throw error;
    }
  }

  // Function to retrieve the profile picture of a member by memberID
  static async getMemberProfilePicture(memberID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the input for the stored procedure
      request.input("memberID", sql.Int, memberID);

      // Execute the stored procedure to get the profile picture
      const result = await request.execute("getMemberProfilePicture");

      connection.close();

      // If no profile picture is found, return null
      if (result.recordset.length === 0) {
        return null;
      }

      // Return the profile picture URL
      return result.recordset[0].profilePicture;
    } catch (error) {
      console.error("Error retrieving profile picture:", error);
      throw error;
    }
  }
}

module.exports = Member;
