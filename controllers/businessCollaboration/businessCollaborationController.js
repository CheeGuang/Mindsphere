// ========== Models ==========
const BusinessCollaboration = require("../../models/businessCollaboration");

// ========== Controller ==========
class BusinessCollaborationController {
  // Get Business Collaborations
  static async getBusinessCollaborations(req, res) {
    try {
      // Retrieve the collaborationID from the query parameters if provided
      const { collaborationID } = req.query;

      // Fetch business collaborations
      const collaborations =
        await BusinessCollaboration.getBusinessCollaborations(
          collaborationID ? parseInt(collaborationID, 10) : null
        );

      // Return the fetched collaborations as the response
      res.status(200).json({
        success: true,
        data: collaborations,
      });
    } catch (error) {
      console.error(`Error in getBusinessCollaborations: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to fetch business collaborations.",
      });
    }
  }

  // Create a New Business Collaboration
  static async createBusinessCollaboration(req, res) {
    try {
      // Extract the details from the request body
      const {
        businessName,
        contactNumber,
        businessEmail,
        requestedDate,
        requestedTime,
        venue,
        description,
        participants,
        lunchNeeded,
      } = req.body;

      // Validate required fields
      if (
        !businessName ||
        !contactNumber ||
        !businessEmail ||
        !requestedDate ||
        !requestedTime
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });
      }

      // Call the model function to create a new business collaboration
      const newCollaboration =
        await BusinessCollaboration.createBusinessCollaboration({
          businessName,
          contactNumber,
          businessEmail,
          requestedDate,
          requestedTime,
          venue,
          description,
          participants: participants ? parseInt(participants, 10) : null,
          lunchNeeded: lunchNeeded ? Boolean(lunchNeeded) : false,
        });

      // Return the created collaboration ID as the response
      res.status(201).json({
        success: true,
        data: newCollaboration,
        message: "Business collaboration created successfully.",
      });
    } catch (error) {
      console.error(`Error in createBusinessCollaboration: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to create business collaboration.",
      });
    }
  }
}

// ========== Export ==========
module.exports = BusinessCollaborationController;
