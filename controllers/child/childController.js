// ========== Models ==========
const Template = require("../../models/template");

// ========== Controller ==========
class TemplateController {
  // Template function handler
  static async templateFunction(req, res) {
    try {
      // Instantiate the model
      const templateModel = new Template();

      // Call the template function
      const message = templateModel.templateFunction();

      // Return the message as the response
      res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      console.error(`Error in templateFunction: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to execute template function.",
      });
    }
  }
}

// ========== Export ==========
module.exports = TemplateController;
