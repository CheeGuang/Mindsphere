const sql = require("mssql");
const dbConfig = require("../dbConfig");
const EmailService = require("./emailService"); // Import EmailService
const bcrypt = require("bcrypt"); // Import bcrypt

class Admin {
  constructor(
    adminID,
    firstName,
    lastName,
    email,
    profilePicture,
    contactNo,
    availability,
    bio,
    calendlyLink,
    calendlyAccessToken
  ) {
    this.adminID = adminID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profilePicture = profilePicture;
    this.contactNo = contactNo;
    this.availability = availability; // New field for availability
    this.bio = bio; // New field for bio
    this.calendlyLink = calendlyLink;
    this.calendlyAccessToken = calendlyAccessToken;
  }

  // Function to create a Google admin using stored procedure
  static async createGoogleAdmin(
    firstName,
    lastName,
    email,
    profilePicture = null,
    availability = null, // New parameter for availability
    bio = null // New parameter for bio
  ) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("Email", sql.NVarChar(100), email);
      request.input("profilePicture", sql.NVarChar(500), profilePicture);
      request.input("availability", sql.NVarChar(sql.MAX), availability); // Input for availability
      request.input("bio", sql.NVarChar(1000), bio); // Input for bio

      const result = await request.execute("usp_create_google_admin");

      connection.close();

      // Return the newly created adminID
      return result.recordset[0].adminID;
    } catch (error) {
      console.error("Error creating Google admin:", error);
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
        "usp_check_email_and_contact_exists_admin"
      );

      connection.close();

      // Check for the presence of adminID and return accordingly
      if (
        result.recordset[0].EmailExists === 1 &&
        result.recordset[0].ContactExists === 1
      ) {
        return {
          emailExists: true,
          contactExists: true,
          adminID: result.recordset[0].adminID, // Returning adminID when both email and contact exist
        };
      } else if (result.recordset[0].EmailExists === 1) {
        return {
          emailExists: true,
          contactExists: false,
          adminID: result.recordset[0].adminID, // Returning adminID even if contact doesn't exist
        };
      } else {
        return {
          emailExists: false,
          contactExists: false,
          adminID: null, // Email doesn't exist, no adminID returned
        };
      }
    } catch (error) {
      console.error("Error checking email and contact:", error);
      throw error;
    }
  }

  // Function to update an admin's contact number using stored procedure
  static async updateAdminContact(adminID, contactNo) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("adminID", sql.Int, adminID);
      request.input("contactNo", sql.NVarChar(20), contactNo);

      const result = await request.execute("usp_update_admin_contact");

      connection.close();

      // Return success message from the stored procedure
      return result.recordset[0].Message;
    } catch (error) {
      console.error("Error updating admin contact:", error);
      throw error;
    }
  }

  // Function to update Google admin using the new stored procedure
  static async updateGoogleAdmin(
    firstName,
    lastName,
    email,
    profilePicture = null,
    availability = null, // New parameter for availability
    bio = null // New parameter for bio
  ) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("firstName", sql.NVarChar(100), firstName);
      request.input("lastName", sql.NVarChar(100), lastName);
      request.input("Email", sql.NVarChar(100), email);
      request.input("profilePicture", sql.NVarChar(500), profilePicture);
      request.input("availability", sql.NVarChar(sql.MAX), availability); // Input for availability
      request.input("bio", sql.NVarChar(1000), bio); // Input for bio

      const result = await request.execute("usp_update_google_admin");

      connection.close();

      // Return the updated adminID if successful
      return result.recordset[0].newAdminID;
    } catch (error) {
      console.error("Error updating Google admin:", error);
      throw error;
    }
  }

  // Function to create an admin using stored procedure with password encryption
  static async createAdmin(
    firstName,
    lastName,
    email,
    contactNo,
    password,
    availability = null,
    bio = null
  ) {
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
      request.input("availability", sql.NVarChar(sql.MAX), availability); // Input for availability
      request.input("bio", sql.NVarChar(1000), bio); // Input for bio

      const result = await request.execute("usp_create_admin");

      connection.close();

      // Return the newly created adminID
      return result.recordset[0].newAdminID;
    } catch (error) {
      console.error("Error creating admin:", error);
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
      await request.execute("usp_update_or_create_admin_by_email");

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
      const result = await request.execute("usp_get_admin_email_verification");

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

  // Function to login an admin by comparing the stored password with the provided password
  static async loginAdmin(email, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Retrieve the admin's hashed password from the database
      request.input("email", sql.NVarChar(100), email);
      const passwordResult = await request.execute(
        "usp_get_admin_password_by_email"
      );

      // If no admin is found with the provided email
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

      // If password matches, retrieve the adminID
      const adminIDRequest = connection.request();
      adminIDRequest.input("email", sql.NVarChar(100), email);
      const adminIDResult = await adminIDRequest.execute(
        "usp_get_admin_id_by_email"
      );

      connection.close();

      // Return success with the adminID
      return {
        success: true,
        message: "Login successful.",
        adminID: adminIDResult.recordset[0].adminID, // Return adminID upon successful login
      };
    } catch (error) {
      console.error("Error logging in admin:", error);
      throw error;
    }
  }

  // Function to update an admin's password using stored procedure
  static async updateAdminPassword(email, newPassword) {
    try {
      // Hash the new password using bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the inputs for the stored procedure
      request.input("email", sql.NVarChar(100), email);
      request.input("newPassword", sql.NVarChar(100), hashedPassword); // Store hashed password

      // Execute the stored procedure to update the password
      const result = await request.execute(
        "usp_admin_update_password_by_email"
      );

      connection.close();

      // Return the result message from the stored procedure
      return result.recordset[0].Message;
    } catch (error) {
      console.error("Error updating admin password:", error);
      throw error;
    }
  }

  // Function to retrieve the profile picture of an admin by adminID
  static async getAdminProfilePicture(adminID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the input for the stored procedure
      request.input("adminID", sql.Int, adminID);

      // Execute the stored procedure to get the profile picture
      const result = await request.execute("getAdminProfilePicture");

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

  // Function to get admin details by adminID using the stored procedure
  static async getAdminDetailsById(adminID) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the input for the stored procedure
      request.input("adminID", sql.Int, adminID);

      // Execute the stored procedure
      const result = await request.execute("usp_get_admin_details_by_id");

      connection.close();

      // Check if the result has data
      if (result.recordset.length === 0) {
        return null; // No admin found with the given adminID
      }

      // Return the admin details, including availability and bio
      return {
        adminID: result.recordset[0].adminID,
        firstName: result.recordset[0].firstName,
        lastName: result.recordset[0].lastName,
        email: result.recordset[0].email,
        profilePicture: result.recordset[0].profilePicture,
        contactNo: result.recordset[0].contactNo,
        availability: result.recordset[0].availability,
        bio: result.recordset[0].bio,
        calendlyLink: result.recordset[0].calendlyLink,
      };
    } catch (error) {
      console.error("Error retrieving admin details:", error);
      throw error;
    }
  }

  // Function to update an admin's availability using the stored procedure
  static async updateAdminAvailability(adminID, newAvailability) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the inputs for the stored procedure
      request.input("adminID", sql.Int, adminID);
      request.input("newAvailability", sql.NVarChar(sql.MAX), newAvailability);

      // Execute the stored procedure to update the availability
      const result = await request.execute("usp_update_admin_availability");

      connection.close();

      // Check if the update was successful
      if (result.returnValue === 0) {
        return {
          success: true,
          message: "Availability updated successfully.",
        };
      } else {
        return {
          success: false,
          message: "Failed to update availability.",
        };
      }
    } catch (error) {
      console.error("Error updating admin availability:", error);
      throw error;
    }
  }

  static async getAllAdmins() {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Execute the stored procedure to get all admins
      const result = await request.execute("usp_get_all_admins");

      connection.close();

      // Return the list of admins with profile picture and bio
      return result.recordset;
    } catch (error) {
      console.error("Error retrieving all admins:", error);
      throw error;
    }
  }

  // Function to update the Calendly link by adminID
  static async updateCalendlyLink(adminID, calendlyLink) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the inputs for the stored procedure
      request.input("adminID", sql.Int, adminID);
      request.input("calendlyLink", sql.NVarChar(500), calendlyLink);

      // Execute the stored procedure
      const result = await request.execute("usp_update_calendly_link");

      connection.close();

      // Check if the update was successful
      if (result.returnValue === 0) {
        return {
          success: true,
          message: "Calendly link updated successfully.",
        };
      } else {
        return {
          success: false,
          message: "Failed to update Calendly link.",
        };
      }
    } catch (error) {
      console.error("Error updating Calendly link:", error);
      throw error;
    }
  }

  // Function to update the Calendly access token for an admin using the stored procedure
  static async updateCalendlyAccessToken(adminID, newAccessToken) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      // Set the input parameters for the stored procedure
      request.input("adminID", sql.Int, adminID);
      request.input("newAccessToken", sql.NVarChar(500), newAccessToken);

      console.log(adminID);
      console.log(newAccessToken);
      // Execute the stored procedure
      const result = await request.execute("usp_update_calendly_access_token");
      console.log(result);

      connection.close();

      // Check if the update was successful
      return {
        success: result.returnValue === 0,
        message:
          result.returnValue === 0
            ? "Calendly access token updated successfully."
            : "Update failed. No matching adminID found.",
      };
    } catch (error) {
      console.error("Error updating Calendly access token:", error);
      throw error;
    }
  }


 static async updateAdminInfo(adminID, newAdminData) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("adminID", sql.Int, adminID);
        request.input("firstName", sql.NVarChar, newAdminData.firstName || null);
        request.input("lastName", sql.NVarChar, newAdminData.lastName || null);
        request.input("email", sql.NVarChar, newAdminData.email || null);
        request.input("contactNo", sql.NVarChar, newAdminData.contactNo || null);
        request.input("bio", sql.NVarChar, newAdminData.bio || null);

        const result = await request.execute("usp_update_admin");

        // Check if the stored procedure returned an error
        if (result.recordset[0].ErrorMessage) {
            console.error("Error:", result.recordset[0].ErrorMessage);
            throw new Error(result.recordset[0].ErrorMessage);
        }

        return result.recordset[0].updatedAdminID;
    } catch (error) {
        console.error("Error updating admin:", error);
        throw error;
    } finally {
        if (connection) {
            connection.close();
        }
    }
}



}

// ========== Export ==========
module.exports = Admin;
