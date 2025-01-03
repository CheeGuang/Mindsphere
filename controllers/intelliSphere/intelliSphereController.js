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

  // Function to process input and generate learning materials
  static async processInputAndGenerateJSON(req, res) {
    try {
      const { input, inputType, fileType } = req.body; // Expecting input, inputType, and optional fileType in the request body

      // Validate input
      if (!input || !inputType) {
        return res.status(400).json({
          success: false,
          message: "Input and inputType are required.",
        });
      }

      // Validate fileType for 'file' inputType
      const supportedFileTypes = ["txt", "pdf", "docx", "pptx"];
      if (inputType === "file") {
        if (!fileType) {
          return res.status(400).json({
            success: false,
            message: "fileType is required when inputType is 'file'.",
          });
        }
        if (!supportedFileTypes.includes(fileType)) {
          return res.status(400).json({
            success: false,
            message: `Unsupported fileType. Supported types are: ${supportedFileTypes.join(
              ", "
            )}.`,
          });
        }
      }

      // Call the model function to process the input and generate the JSON
      const result = await LearningAssistant.processInputAndGenerateJSON(
        input,
        inputType,
        fileType
      );

      // Check if the model encountered an error
      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error,
        });
      }

      // Return the result
      return res.status(200).json({
        success: true,
        data: result.learningMaterials,
      });
    } catch (error) {
      console.error("Error processing input:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing the input.",
      });
    }
  }
}

// ========== Export ==========
module.exports = IntelliSphereController;
