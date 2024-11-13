// ========== Models ==========
const Voucher = require("../../models/voucher");

// ========== Controller ==========
class VoucherController {
  // Function to get vouchers by memberID
  static async getVouchersByMemberID(req, res) {
    try {
      // Extract memberID from request parameters
      const { memberID } = req.params;

      // Validate the input
      if (!memberID || isNaN(memberID)) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing memberID.",
        });
      }

      console.log(`[DEBUG] Retrieving vouchers for memberID: ${memberID}`);

      // Call the model's function to get vouchers
      const vouchers = await Voucher.getVouchersByMemberID(parseInt(memberID));

      // Return the vouchers as the response
      res.status(200).json({
        success: true,
        data: vouchers,
      });
    } catch (error) {
      console.error(`Error in getVouchersByMemberID: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve vouchers.",
      });
    }
  }
}

// ========== Export ==========
module.exports = VoucherController;
