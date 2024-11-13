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

  // Function to redeem a voucher by voucherID
  static async redeemVoucher(req, res) {
    try {
      // Extract voucherID from request parameters
      const { voucherID } = req.params;

      // Validate the input
      if (!voucherID || isNaN(voucherID)) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing voucherID.",
        });
      }

      console.log(`[DEBUG] Redeeming voucher for voucherID: ${voucherID}`);

      // Call the model's function to redeem the voucher
      const result = await Voucher.redeemVoucher(parseInt(voucherID));

      // Check for success or error messages from the model
      if (result.successMessage) {
        res.status(200).json({
          success: true,
          message: result.successMessage,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.errorMessage || "Failed to redeem the voucher.",
        });
      }
    } catch (error) {
      console.error(`Error in redeemVoucher: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to redeem the voucher.",
      });
    }
  }
}

// ========== Export ==========
module.exports = VoucherController;
