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

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to assess speech.`);

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
        Your task is to evaluate the transcription of a speech based solely on the text provided.

        Based on the transcription, provide:
        1. An overall score out of 100. This score should be graded strictly:
          - If the speaker stutters or has significant interruptions, the overall score will be below 30.
          - Exceptional speeches should score above 80, but this is rare.
          - Average speeches with minor flaws should fall between 50-79.
          - Poor speeches with notable issues in multiple areas should score below 50.
        2. A fluency score from 1-5 based on a clear marking scheme below:
          - 5: Text flows smoothly and logically with no significant interruptions or incoherence.
          - 4: Mostly smooth text with minor breaks or inconsistencies that do not impede understanding.
          - 3: Some interruptions or uneven flow but still generally coherent.
          - 2: Noticeable interruptions or inconsistencies that slightly affect clarity.
          - 1: Very disjointed text with significant clarity issues.
        3. A lexical score from 1-5, based on vocabulary range, accuracy, and variety.
        4. A grammar score from 1-5, based on grammatical accuracy, sentence complexity, and frequency of errors.
        5. An engagement score from 1-5, based on the content's ability to capture interest, convey enthusiasm, or interact with an audience, as inferred from the text.
        6. List 5 points that went well, providing specific examples from the transcription wherever possible.
        7. List 5 points that did not go well, providing specific examples from the transcription wherever possible.
        8. Suggest 5 concrete actions that can be taken to improve the text of the speech, using examples wherever possible to clarify the suggestions.

        Use Vinh Giang's speech as the benchmark for a score of 10, but apply the criteria fairly based on the transcription provided.
        Grade strictly overall, ensuring that only truly exceptional speeches receive high scores.

        **Important**:
        - Ensure the JSON output is syntactically correct and free from errors.
        - Properly escape all special characters in strings (e.g., quotes, newlines).
        - Ensure there are no trailing commas in arrays or objects.
        - Return the response **strictly** as a JSON object without any additional formatting, such as \`\`\`json or \`\`\`.

        The response should only be in the following structure:

        {"success": true,"evaluation": {"overallScore": <overall_score>,"fluencyScore": <fluency_score>,"lexicalScore": <lexical_score>,"grammarScore": <grammar_score>,"engagementScore": <engagement_score>,"pointsWentWell": [...],"pointsDidNotGoWell": [...],"improvementActions": [...]}}`;

        const evaluationResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: transcription.text },
          ],
        });

        const evaluation = evaluationResponse.choices[0].message.content;

        console.log(`[DEBUG] Response from GPT4o Mini: ${evaluation}`);

        function cleanJsonString(input) {
          // Check if the string starts with ```json and ends with ```
          if (input.startsWith("```json") && input.endsWith("```")) {
            // Remove the starting ```json and trailing ```
            return input.slice(7, -3).trim();
          }
          return input; // Return the string unchanged if it doesn't match the pattern
        }

        const cleanEvaluation = cleanJsonString(evaluation);

        // Return the evaluation result
        return {
          success: true,
          evaluation: JSON.parse(cleanEvaluation),
        };
      } catch (error) {
        console.error(`Error on attempt ${attempt}:`, error);
        if (attempt === maxRetries) {
          throw new Error(
            "An error occurred during speech assessment after multiple attempts."
          );
        }
        console.log("Retrying...");
      }
    }
  }

  static async processInputAndGenerateJSON(input, inputType, fileType = null) {
    try {
      let content = "";

      // Parse content based on input type
      if (inputType === "text") {
        content = input;
      } else if (inputType === "file" && fileType) {
        const buffer = Buffer.from(input, "base64");
        if (fileType === "txt") {
          content = buffer.toString("utf-8");
        } else if (fileType === "pdf") {
          const data = await pdfParse(buffer);
          content = data.text;
        } else if (fileType === "docx") {
          const result = await mammoth.extractRawText({ buffer });
          content = result.value;
        } else if (fileType === "pptx") {
          const slides = await pptxParser(buffer);
          content = slides.map((slide) => slide.text).join("\n");
        } else {
          throw new Error("Unsupported file format.");
        }
      } else {
        throw new Error("Invalid input type or missing file type.");
      }

      // Generate learning materials using OpenAI
      const prompt = `You are an expert tutor. Based on the following material:

"""
${content}
"""

Generate the following in JSON format:
1. Reading materials summarising the key points.
2. Detailed notes expanding on each key point.
3. 10 practice questions with answers related to the material.

Ensure the JSON response is formatted as follows:
{
  "success": true,
  "learningMaterials": {
    "summary": "...",
    "notes": ["..."],
    "practiceQuestions": [
      {
        "question": "...",
        "answer": "..."
      }
    ]
  }
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a JSON response generator." },
          { role: "user", content: prompt },
        ],
      });

      const output = response.choices[0].message.content;

      function cleanJsonString(input) {
        if (input.startsWith("```json") && input.endsWith("```")) {
          return input.slice(7, -3).trim();
        }
        return input;
      }

      const cleanOutput = cleanJsonString(output);
      return JSON.parse(cleanOutput);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = IntelliSphere;
