const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Child {
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
      console.log("Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("Database connected.");

      console.log("Executing stored procedure: usp_registerChild");
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

      console.log("Stored procedure executed successfully.");

      // Return the output values
      const output = {
        childID: result.output.childID,
        memberChildID: result.output.memberChildID,
      };

      return output;
    } catch (error) {
      console.error(`Error in Child.registerChild: ${error.message}`);
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("Database connection closed.");
      }
    }
  }
}

module.exports = Child;
