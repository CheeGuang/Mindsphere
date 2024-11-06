const fs = require("fs");
const path = require("path");
const OpenAI = require("openai"); // Ensure OpenAI SDK is installed

const openai = new OpenAI({ apiKey: process.env.OpenAIAPIKey }); // Initialize OpenAI client

class IntelliSphere {
  constructor() {
    console.log("IntelliSphere model initialized");
  }

  // Function to assess speech
  static async assessSpeech(audioBase64) {
    if (!audioBase64 || typeof audioBase64 !== "string") {
      throw new Error(
        "Invalid audio input. Please provide a valid base64 audio string."
      );
    }

    try {
      // Decode base64 and save as MP3
      const audioBuffer = Buffer.from(audioBase64, "base64");
      const audioFilePath = path.join(__dirname, "temp_audio.mp3");
      fs.writeFileSync(audioFilePath, audioBuffer);
      console.log("Audio saved as MP3:", audioFilePath);

      // Use the OpenAI SDK to send the MP3 file for transcription
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
        language: "en", // Change to the appropriate language code if needed
      });

      // Clean up temporary file
      fs.unlinkSync(audioFilePath);

      if (!transcription.text) {
        throw new Error("Transcription failed. No text received.");
      }

      console.log("Transcription received:", transcription.text);

      // Define system prompt for GPT evaluation
      const systemPrompt = `
      You are a helpful assistant for evaluating speeches. 
      Based on the transcription, provide:
      1. An overall score out of 100.
      2. A fluency score from 1-5 based on a clear marking scheme below:
         - 5: Smooth, confident delivery with excellent pacing and no noticeable hesitations.
         - 4: Mostly smooth delivery with minor hesitations and consistent pacing.
         - 3: Some hesitations and uneven pacing but generally understandable.
         - 2: Noticeable hesitations and inconsistent pacing affecting clarity.
         - 1: Very hesitant and disjointed delivery with significant clarity issues.
      3. A lexical score from 1-5, based on vocabulary range, accuracy, and variety.
      4. A grammar score from 1-5, based on accuracy, complexity, and error frequency.
      5. An engagement score from 1-5, based on audience interaction, enthusiasm, and ability to capture interest.
      6. List 5 points that went well.
      7. List 5 points that did not go well.
      8. Suggest 5 concrete actions that can be taken to improve the speech.
      
      Use Vinh Giang's speech as the benchmark for a score of 10.
      If the user's response is illogical, excessively brief, or rude, mark all scores as low. Always provide a response, even if it is a general remark.
      
      Return the response in JSON format with the following structure:
      {"success": true,"evaluation": {"overallScore": <overall_score>,"fluencyScore": <fluency_score>,"lexicalScore": <lexical_score>,"grammarScore": <grammar_score>,"engagementScore": <engagement_score>,"pointsWentWell": [...],"pointsDidNotGoWell": [...],"improvementActions": [...]}}`; // Send transcription text to GPT model
      const evaluationResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: transcription.text },
        ],
      });

      const evaluation = evaluationResponse.choices[0].message.content;
      console.log("Evaluation response:", JSON.parse(evaluation));

      // Return the evaluation result
      return {
        success: true,
        evaluation: JSON.parse(evaluation),
      };
    } catch (error) {
      console.error("Error assessing speech:", error);
      throw new Error("An error occurred during speech assessment.");
    }
  }
}

module.exports = IntelliSphere;
