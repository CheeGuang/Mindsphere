const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class BusinessCollaboration {
  // Function to get business collaborations
  static async getBusinessCollaborations(collaborationID = null) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_get_business_collaborations"
      );
      console.log("[DEBUG] Input parameter:", { collaborationID });

      const request = pool.request();
      if (collaborationID !== null) {
        request.input("collaborationID", sql.Int, collaborationID); // Input parameter for filtering
      }

      const result = await request.execute("usp_get_business_collaborations"); // Execute the stored procedure

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure result:", result);

      // Extract and log the returned recordset
      const collaborations = result.recordset;
      console.log("[DEBUG] Business collaborations:", collaborations);

      return collaborations;
    } catch (error) {
      console.error(
        `[DEBUG] Error in BusinessCollaboration.getBusinessCollaborations: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }

  // Function to create a new business collaboration
  static async createBusinessCollaboration({
    businessName,
    contactNumber,
    businessEmail,
    requestedDate,
    requestedTime,
    venue,
    description,
    participants,
    lunchNeeded,
  }) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_create_business_collaboration"
      );
      console.log("[DEBUG] Input parameters:", {
        businessName,
        contactNumber,
        businessEmail,
        requestedDate,
        requestedTime,
        venue,
        description,
        participants,
        lunchNeeded,
      });

      const result = await pool
        .request()
        .input("businessName", sql.NVarChar(200), businessName)
        .input("contactNumber", sql.NVarChar(20), contactNumber)
        .input("businessEmail", sql.NVarChar(100), businessEmail)
        .input("requestedDate", sql.Date, requestedDate)
        .input("requestedTime", sql.NVarChar(50), requestedTime)
        .input("venue", sql.NVarChar(500), venue)
        .input("description", sql.NVarChar(1000), description)
        .input("participants", sql.Int, participants)
        .input("lunchNeeded", sql.Bit, lunchNeeded)
        .execute("usp_create_business_collaboration"); // Execute the stored procedure

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure result:", result);

      // Extract the ID of the newly created collaboration from the result
      const collaborationID = result.recordset[0].collaborationID;
      console.log("[DEBUG] New collaboration ID:", collaborationID);

      return { collaborationID };
    } catch (error) {
      console.error(
        `[DEBUG] Error in BusinessCollaboration.createBusinessCollaboration: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }
}

module.exports = BusinessCollaboration;
