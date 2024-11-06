// ========== Models ==========
// Import the IntelliSphere model
const IntelliSphere = require("../../models/intelliSphere");

// ========== Controller ==========
class IntelliSphereController {
  // Function to assess speech
  static async assessSpeech(req, res) {
    try {
      const { audioBase64 } = req.body; // Expecting audioBase64 in the request body

      console.log(audioBase64);
      // Validate input
      if (!audioBase64) {
        return res
          .status(400)
          .json({ success: false, message: "Audio data is required." });
      }

      // Call the model function to process the audio and get the evaluation
      const evaluation = await IntelliSphere.assessSpeech(audioBase64);

      // Return the evaluation result
      return res.status(200).json({
        success: true,
        evaluation,
      });
    } catch (error) {
      console.error("Error assessing speech:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while assessing the speech.",
      });
    }
  }
}

// ========== Export ==========
module.exports = IntelliSphereController;
