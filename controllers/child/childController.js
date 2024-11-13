// ========== Models ==========
const Child = require("../../models/child"); // Import the Child model

// ========== Controller ==========
class ChildController {
  // Function to handle child registration
  static async registerChild(req, res) {
    try {
      const childrenData = req.body; // Expecting an array of children
      console.log("[DEBUG] Incoming request data:", childrenData);

      if (!Array.isArray(childrenData) || childrenData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Request body must contain an array of child data.",
        });
      }

      const results = [];
      for (const child of childrenData) {
        const {
          memberID,
          firstName,
          lastName,
          age,
          schoolName,
          medicalConditions,
          dietaryPreferences,
          interests,
          relationship,
        } = child;

        // Validate required fields for each child
        const missingFields = [];
        if (!memberID) missingFields.push("memberID");
        if (!firstName) missingFields.push("firstName");
        if (!lastName) missingFields.push("lastName");
        if (!age) missingFields.push("age");
        if (!relationship) missingFields.push("relationship");

        if (missingFields.length > 0) {
          console.log(
            "[DEBUG] Missing required fields:",
            missingFields.join(", ")
          );
          return res.status(400).json({
            success: false,
            message: `Missing required fields for child: ${missingFields.join(
              ", "
            )}`,
          });
        }

        // Call the model function for each child
        const output = await Child.registerChild({
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

        console.log("[DEBUG] Model output for child:", output);
        results.push(output);
      }

      // Return success response with results
      res.status(200).json({
        success: true,
        message: "Children registered successfully.",
        data: results,
      });
    } catch (error) {
      console.error(`[DEBUG] Error in registerChild: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to register children.",
      });
    }
  }

  // Function to get child details by memberID
  static async getChildByMemberID(req, res) {
    try {
      const { memberID } = req.params; // Extract memberID from request parameters
      console.log("[DEBUG] Fetching children for memberID:", memberID);

      if (!memberID) {
        return res.status(400).json({
          success: false,
          message: "Member ID is required.",
        });
      }

      // Call the model function to get child details
      const children = await Child.getChildByMemberID(memberID);

      if (children.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No children found for the given member ID.",
        });
      }

      // Return success response with child details
      res.status(200).json({
        success: true,
        message: "Children fetched successfully.",
        data: children,
      });
    } catch (error) {
      console.error(`[DEBUG] Error in getChildByMemberID: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to fetch child details.",
      });
    }
  }
}

// ========== Export ==========
module.exports = ChildController;
