// ========== Models ==========
const Referral = require("../../models/referral");

// ========== Controller ==========
class ReferralController {
  // Get referral details by memberID
  static async getDetails(req, res) {
    try {
      const { memberID } = req.params; // Extract memberID from request parameters

      // Validate input
      if (!memberID) {
        return res.status(400).json({
          success: false,
          message: "Member ID is required.",
        });
      }

      // Call the model's function to get referral details
      const referralDetails = await Referral.getReferralDetailsByMemberID(
        parseInt(memberID)
      );

      // Structure the response, including the unredeemed vouchers count
      const { referralsMade, referredBy, totalUnredeemedVouchers } =
        referralDetails;

      // Return the referral details as the response
      res.status(200).json({
        success: true,
        data: {
          referralsMade,
          referredBy,
          totalUnredeemedVouchers,
        },
      });
    } catch (error) {
      console.error(`Error in getDetails: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve referral details.",
      });
    }
  }
}

// ========== Export ==========
module.exports = ReferralController;
