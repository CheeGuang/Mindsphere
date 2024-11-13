const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Voucher {
  // Function to retrieve vouchers by memberID
  static async getVouchersByMemberID(memberID) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_get_vouchers_by_memberID"
      );
      console.log("[DEBUG] Input parameter:", { memberID });

      const result = await pool
        .request()
        .input("memberID", sql.Int, memberID)
        .execute("usp_get_vouchers_by_memberID"); // Execute the stored procedure

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure result:", result);

      // Extract the result set
      const vouchers = result.recordset; // Result set: Vouchers for the specified memberID

      console.log("[DEBUG] Vouchers retrieved:", vouchers);

      // Return the vouchers
      return vouchers;
    } catch (error) {
      console.error(
        `[DEBUG] Error in Voucher.getVouchersByMemberID: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }

  static async redeemVoucher(voucherID) {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("[DEBUG] Database connected successfully.");

      console.log(
        "[DEBUG] Preparing to execute stored procedure: usp_redeem_voucher"
      );
      console.log("[DEBUG] Input parameter:", { voucherID });

      // Execute the stored procedure
      const result = await pool
        .request()
        .input("voucherID", sql.Int, voucherID)
        .output("successMessage", sql.NVarChar(255))
        .output("errorMessage", sql.NVarChar(255))
        .execute("usp_redeem_voucher");

      console.log("[DEBUG] Stored procedure executed successfully.");
      console.log("[DEBUG] Stored procedure outputs:", {
        successMessage: result.output.successMessage,
        errorMessage: result.output.errorMessage,
      });

      // Return the success or error message
      return {
        successMessage: result.output.successMessage,
        errorMessage: result.output.errorMessage,
      };
    } catch (error) {
      console.error(`[DEBUG] Error in Voucher.redeemVoucher: ${error.message}`);
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }
}

module.exports = Voucher;
