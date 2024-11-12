const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Referral {
  // Function to retrieve referral details by memberID
  static async getReferralDetailsByMemberID(memberID) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_getReferralDetailsByMemberID"
      );
      console.log("[DEBUG] Input parameter:", { memberID });

      const result = await pool
        .request()
        .input("memberID", sql.Int, memberID)
        .execute("usp_getReferralDetailsByMemberID"); // Execute the stored procedure

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure result:", result);

      // Extract the result sets
      const referralsMade = result.recordsets[0]; // First result set: Total referrals made
      const referredBy = result.recordsets[1]; // Second result set: Referral info if referred by someone
      const totalUnredeemedVouchers = result.recordsets[2]; // Third result set: Total unredeemed vouchers

      console.log("[DEBUG] Referrals made:", referralsMade);
      console.log("[DEBUG] Referred by:", referredBy);
      console.log(
        "[DEBUG] Total unredeemed vouchers:",
        totalUnredeemedVouchers
      );

      // Consolidate the data
      return {
        referralsMade,
        referredBy,
        totalUnredeemedVouchers:
          totalUnredeemedVouchers[0]?.TotalUnredeemedVouchers || 0,
      };
    } catch (error) {
      console.error(
        `[DEBUG] Error in Referral.getReferralDetailsByMemberID: ${error.message}`
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

module.exports = Referral;
