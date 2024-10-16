const sql = require("mssql");
const dbConfig = require("../dbConfig");

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

  // Function to check if email exists using stored procedure
  static async checkEmailExists(email) {
    try {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();

      request.input("Email", sql.NVarChar(100), email);

      const result = await request.execute("usp_check_email_exists");

      connection.close();

      // Return emailExists and memberID if email exists
      if (result.recordset[0].EmailExists === 1) {
        return {
          emailExists: true,
          memberID: result.recordset[0].memberID,
        };
      } else {
        return {
          emailExists: false,
        };
      }
    } catch (error) {
      console.error("Error checking email:", error);
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
}

module.exports = Member;
