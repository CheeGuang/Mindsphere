const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Child {
  // Function to get child details by memberID
  static async getChildByMemberID(memberID) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_get_child_by_memberID"
      );
      console.log("[DEBUG] Input parameter:", { memberID });

      const result = await pool
        .request()
        .input("memberID", sql.Int, memberID) // Input parameter for the memberID
        .execute("usp_get_child_by_memberID"); // Execute the stored procedure

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure result:", result);

      // Extract and log the returned recordset
      const children = result.recordset;
      console.log("[DEBUG] Children details:", children);

      return children;
    } catch (error) {
      console.error(
        `[DEBUG] Error in Child.getChildByMemberID: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }

  // Function to register a new child and associate them with a member
  static async registerChild({
    memberID,
    firstName,
    lastName,
    age,
    schoolName,
    medicalConditions,
    dietaryPreferences,
    interests,
    relationship,
  }) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_registerChild"
      );
      console.log("[DEBUG] Input parameters:", {
        memberID,
        firstName,
        lastName,
        age,
        schoolName,
        medicalConditions,
        dietaryPreferences,
        interests,
        relationship,
      });

      const result = await pool
        .request()
        .input("memberID", sql.Int, memberID)
        .input("firstName", sql.NVarChar(100), firstName)
        .input("lastName", sql.NVarChar(100), lastName)
        .input("age", sql.Int, age)
        .input("schoolName", sql.NVarChar(100), schoolName)
        .input("medicalConditions", sql.NVarChar(500), medicalConditions)
        .input("dietaryPreferences", sql.NVarChar(500), dietaryPreferences)
        .input("interests", sql.NVarChar(500), interests)
        .input("relationship", sql.NVarChar(100), relationship)
        .output("childID", sql.Int) // Output parameter for the generated child ID
        .output("memberChildID", sql.Int) // Output parameter for the generated memberChild ID
        .execute("usp_registerChild"); // Execute the stored procedure

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure result:", result);

      // Extract and log output values
      const output = {
        childID: result.output.childID,
        memberChildID: result.output.memberChildID,
      };
      console.log("[DEBUG] Output values:", output);

      return output;
    } catch (error) {
      console.error(`[DEBUG] Error in Child.registerChild: ${error.message}`);
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }
}

module.exports = Child;
