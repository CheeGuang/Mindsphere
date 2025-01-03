$(document).ready(function () {
  $("#learningForm").on("submit", async function (e) {
    e.preventDefault();

    const textInput = $("#textInput").val().trim();
    const fileInput = $("#fileInput")[0].files[0];

    let inputType = "";
    let input = "";
    let fileType = "";

    if (textInput) {
      inputType = "text";
      input = textInput;
    } else if (fileInput) {
      inputType = "file";
      fileType = fileInput.name.split(".").pop().toLowerCase();

      if (!["txt", "pdf", "docx", "pptx"].includes(fileType)) {
        alert("Unsupported file type. Please upload a valid file.");
        return;
      }

      input = await toBase64(fileInput);
    } else {
      alert("Please provide text input or upload a file.");
      return;
    }

    try {
      const response = await fetch("/process-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, inputType, fileType }),
      });

      const result = await response.json();

      if (result.success) {
        displayResults(result.data);
      } else {
        alert(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  });

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  function displayResults(data) {
    $("#resultsContent").empty();
    $("#resultsContainer").show();

    const summary = `<h3>Summary</h3><p>${data.summary}</p>`;
    const notes = `<h3>Notes</h3><ul>${data.notes
      .map((note) => `<li>${note}</li>`)
      .join("")}</ul>`;
    const questions = `<h3>Practice Questions</h3><ul>${data.practiceQuestions
      .map(
        (q) =>
          `<li><strong>Q:</strong> ${q.question}<br /><strong>A:</strong> ${q.answer}</li>`
      )
      .join("")}</ul>`;

    $("#resultsContent").append(summary, notes, questions);
  }
});
