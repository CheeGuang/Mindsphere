const sql = require("mssql");
const dbConfig = require("../dbConfig");
const EmailService = require("./emailService"); // Import EmailService
const bcrypt = require("bcrypt"); // Import bcrypt

class Member {
  constructor(
    memberID,
    firstName,
    lastName,
    email,
    emailVC,
    emailVCTimestamp,
    contactNo,
    contactNoVC,
    contactNoVCTimestamp,
    password,
    profilePicture,
    membershipEndDate
  ) {
    this.memberID = memberID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.emailVC = emailVC;
    this.emailVCTimestamp = emailVCTimestamp;
    this.contactNo = contactNo;
    this.contactNoVC = contactNoVC;
    this.contactNoVCTimestamp = contactNoVCTimestamp;
    this.password = password;
    this.profilePicture = profilePicture;
    this.membershipEndDate = membershipEndDate;
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

  // Update member contact and referral code
  static async updateMemberContact(req, res) {
    try {
      const { memberID, contactNo, referralCode } = req.body;

      console.debug("Received request to update member contact.");
      console.debug(
        `Request Payload: memberID=${memberID}, contactNo=${contactNo}, referralCode=${
          referralCode || "None"
        }`
      );

      // Validate input
      if (!memberID || !contactNo) {
        console.debug("Validation failed: Missing memberID or contactNo.");
        return res.status(400).json({
          success: false,
          message: "Member ID and contact number are required.",
        });
      }

      console.debug("Input validation passed. Proceeding with update.");

      // Call the model function to update the contact number and referral code
      const message = await Member.updateMemberContact(
        memberID,
        contactNo,
        referralCode
      );

      console.debug("Database update successful.");
      console.debug(`Update Result: ${message}`);

      res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in updateMemberContact: ${error.message}`);

      if (error.message === "Invalid referral code. Update aborted.") {
        console.debug("Error: Invalid referral code provided.");
        res.status(400).json({
          success: false,
          message: "Invalid referral code provided.",
        });
      } else {
        console.debug(
          "Error: An unexpected error occurred during the update process."
        );
        res.status(500).json({
          success: false,
          message: "Failed to update member contact.",
        });
      }
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
  static async createMember(
    firstName,
    lastName,
    email,
    contactNo,
    password,
    referralCode
  ) {
    try {
      // Hash the password using bcrypt before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Add input parameters
      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("email", sql.NVarChar(100), email);
      request.input("contactNo", sql.NVarChar(20), contactNo);
      request.input("password", sql.NVarChar(100), hashedPassword);
      request.input("referralCode", sql.NVarChar(50), referralCode || null);

      // Add output parameters
      request.output("referralSuccessful", sql.Bit);
      request.output("newMemberID", sql.Int); // Output for new member ID

      // Execute the stored procedure
      const result = await request.execute("usp_create_member");

      // Retrieve output values
      const referralSuccessful = result.output.referralSuccessful;
      const newMemberID = result.output.newMemberID;

      // Log the referral success status
      console.log("Referral successful:", referralSuccessful);

      // Close the connection
      connection.close();

      // Return the newMemberID if it exists, otherwise return null
      return newMemberID || null;
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

      // Check if the verification code was provided within 3 minutes of the timestamp
      const currentTime = new Date();
      const timestamp = new Date(emailVCTimestamp);
      const timeDifference = (currentTime - timestamp) / 1000 / 60; // Convert milliseconds to minutes

      if (timeDifference > 3) {
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

  // Function to get member details by memberID using the stored procedure
  static async getMemberDetailsById(memberID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the input for the stored procedure
      request.input("memberID", sql.Int, memberID);

      // Execute the stored procedure
      const result = await request.execute("usp_get_member_details_by_id");

      connection.close();

      // Check if the result has data
      if (result.recordset.length === 0) {
        return null; // No member found with the given memberID
      }

      console.log(result);
      // Return the member details
      return result.recordset[0];
    } catch (error) {
      console.error("Error retrieving member details:", error);
      throw error;
    }
  }

  // Function to get member details by memberEventID using a stored procedure
  static async getMemberDetailsByMemberEventID(memberEventID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the input for the stored procedure
      request.input("memberEventID", sql.Int, memberEventID);

      // Execute the stored procedure
      const result = await request.execute(
        "usp_get_member_details_by_memberEventID"
      );

      connection.close();

      // Check if the result has data
      if (result.recordset.length === 0) {
        return null; // No data found with the given memberEventID
      }

      // Return the member details
      return result.recordset[0];
    } catch (error) {
      console.error("Error retrieving member details by memberEventID:", error);
      throw error;
    }
  }
  static async updateMemberinfo(memberID, newMemberData) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      const request = connection.request();
      request.input("memberID", sql.Int, memberID);
      request.input("firstName", sql.NVarChar, newMemberData.firstName || null);
      request.input("lastName", sql.NVarChar, newMemberData.lastName || null);
      request.input("email", sql.NVarChar, newMemberData.email || null);
      request.input("contactNo", sql.NVarChar, newMemberData.contactNo || null);

      const result = await request.execute("usp_update_member");

      // Check the result to see if the member was updated or not
      if (result.recordset[0].ErrorMessage) {
        console.error("Error:", result.recordset[0].ErrorMessage);
        throw new Error(result.recordset[0].ErrorMessage);
      }

      return result.recordset[0].updatedMemberID;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async deleteMember(id) {
    try {
      const connection = await sql.connect(dbConfig);

      const request = connection.request();
      request.input("memberID", id);
      const result = await request.execute("usp_delete_member");
      connection.close();

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error deleting Member:", error);
      throw error;
    }
  }
}

module.exports = Member;
