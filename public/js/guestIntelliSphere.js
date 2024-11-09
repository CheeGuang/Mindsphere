let mediaRecorder;
let audioChunks = [];

const audioPlayback = $("#audioPlayback");
const confirmButton = $("#confirmButton");
const recordingIndicator = $("#recordingIndicator");

audioPlayback[0].currentTime = 0;
audioPlayback.attr("src", "");

document.getElementById("startRecording").disabled = false;

$("#startRecording").click(async function () {
  audioChunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.onstart = function () {
    recordingIndicator.show();
    audioPlayback.hide();
    confirmButton.prop("disabled", true);
    $("#stopRecording").prop("disabled", false);
  };

  mediaRecorder.ondataavailable = function (event) {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async function () {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);
    audioPlayback.attr("src", audioURL);
    audioPlayback.show();
    audioPlayback[0].load();
    recordingIndicator.hide();
    confirmButton.prop("disabled", false);
  };

  mediaRecorder.start();
});

$("#stopRecording").click(function () {
  mediaRecorder.stop();
  $("#stopRecording").prop("disabled", true);
});

async function sendAudioToController(base64Audio) {
  try {
    const response = await fetch("/api/intelliSphere/assess-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioBase64: base64Audio }),
    });

    const result = await response.json();
    if (result.success) {
      updateEvaluationResults(result.evaluation.evaluation.evaluation);
    } else {
      console.error("Error assessing audio:", result.message);
    }
  } catch (error) {
    console.error("Error sending audio to controller:", error);
  }
}

confirmButton.click(async function () {
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  const reader = new FileReader();
  reader.readAsDataURL(audioBlob);
  reader.onloadend = async () => {
    const base64Audio = reader.result.split(",")[1];
    await sendAudioToController(base64Audio);
  };
});

async function updateEvaluationResults(evaluation) {
  const evaluationContainer = $("#evaluationResultsContainer");
  evaluationContainer.empty();

  if (
    evaluation.overallScore !== undefined &&
    evaluation.fluencyScore !== undefined
  ) {
    evaluationContainer.append(`
      <div class="card my-3">
        <div class="card-body">
          <h5>Overall Score</h5>
          <div class="progress my-2">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: ${evaluation.overallScore}%"
              aria-valuenow="${evaluation.overallScore}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              ${evaluation.overallScore} / 100
            </div>
          </div>
          <h5 class="mt-4">Metrics</h5>
          <canvas id="scoresChart" width="400" height="200"></canvas>
        </div>
      </div>
    `);

    const scoresChartCtx = document
      .getElementById("scoresChart")
      .getContext("2d");
    new Chart(scoresChartCtx, {
      type: "bar",
      data: {
        labels: ["Fluency", "Grammar", "Lexical", "Engagement"],
        datasets: [
          {
            data: [
              evaluation.fluencyScore,
              evaluation.grammarScore,
              evaluation.lexicalScore,
              evaluation.engagementScore,
            ],
            backgroundColor: [
              "rgba(0, 123, 255, 0.5)",
              "rgba(40, 167, 69, 0.5)",
              "rgba(220, 53, 69, 0.5)",
              "rgba(255, 193, 7, 0.5)",
            ],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } },
      },
    });
  }

  if (evaluation.pointsWentWell && evaluation.pointsWentWell.length) {
    evaluationContainer.append(`
      <div class="card my-3">
        <div class="card-body">
          <h5 class="card-title">What Went Well</h5>
          <ul id="evaluationPointsWentWell"></ul>
        </div>
      </div>
    `);
    evaluation.pointsWentWell.forEach((point) => {
      $("#evaluationPointsWentWell").append(`<li>${point}</li>`);
    });
  }

  if (evaluation.pointsDidNotGoWell && evaluation.pointsDidNotGoWell.length) {
    evaluationContainer.append(`
      <div class="card my-3">
        <div class="card-body">
          <h5 class="card-title">What Did Not Go Well</h5>
          <ul id="evaluationPointsDidNotGoWell"></ul>
        </div>
      </div>
    `);
    evaluation.pointsDidNotGoWell.forEach((point) => {
      $("#evaluationPointsDidNotGoWell").append(`<li>${point}</li>`);
    });
  }

  if (evaluation.improvementActions && evaluation.improvementActions.length) {
    evaluationContainer.append(`
      <div class="card my-3">
        <div class="card-body">
          <h5 class="card-title">Steps Moving Forward</h5>
          <ul id="improvementActions"></ul>
        </div>
      </div>
    `);
    evaluation.improvementActions.forEach((action) => {
      $("#improvementActions").append(`<li>${action}</li>`);
    });
  }

  let eventId;
  if (evaluation.overallScore >= 1 && evaluation.overallScore <= 30)
    eventId = 1;
  else if (evaluation.overallScore >= 31 && evaluation.overallScore <= 60)
    eventId = 2;
  else if (evaluation.overallScore >= 61 && evaluation.overallScore <= 100)
    eventId = 3;

  if (eventId) {
    try {
      const response = await fetch(`/api/event/get-event/${eventId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const workshopDetails = await response.json();

      console.log(workshopDetails);

      insertWorkshopDetails(workshopDetails[0]);
    } catch (error) {
      console.error("Error fetching workshop details:", error);
    }
  }
}

function insertWorkshopDetails(workshop) {
  console.log("[DEBUG] insertWorkshopDetails called with:", workshop);

  const evaluationContainer = $("#evaluationResultsContainer");
  if (!evaluationContainer.length) {
    console.error("[ERROR] #evaluationResultsContainer not found in DOM.");
    return;
  }
  console.log("[DEBUG] #evaluationResultsContainer found.");

  const workshopImage = workshop.picture || "./img/misc/image-placeholder.jpg";
  console.log("[DEBUG] Workshop image URL:", workshopImage);

  const formattedDates = formatAvailableDates(workshop.availableDates);
  console.log("[DEBUG] Formatted available dates:", formattedDates);

  const workshopDetailsHTML = `
    <div class="card my-3">
      <img src="${workshopImage}" class="card-img-top" alt="Workshop Image"/>
      <div class="card-body">
        <h5 class="card-title">Recommended Workshop</h5>
        <p><strong>Title:</strong> ${workshop.title}</p>
        <p><strong>Date:</strong> ${formattedDates}</p>
        <p><strong>Time:</strong> ${workshop.time}</p>
        <p><strong>Address:</strong> ${workshop.venue}</p>
        <a href="/guestWorkshopInformation.html?eventID=${workshop.eventID}" class="btn btn-primary w-100">Learn More</a>
      </div>
    </div>
  `;

  console.log("[DEBUG] Generated workshop details HTML:", workshopDetailsHTML);

  evaluationContainer.append(workshopDetailsHTML);
  console.log(
    "[DEBUG] Workshop details appended to #evaluationResultsContainer."
  );
}

function formatAvailableDates(dateString) {
  if (!dateString) return "Dates not available";

  const dates = dateString.split(",").map((date) => new Date(date.trim()));
  const options = { day: "numeric", month: "long", year: "numeric" };

  if (dates.length === 1) {
    // If there is only one date
    return dates[0].toLocaleDateString("en-GB", options);
  }

  // If there are two or more dates
  return `${dates[0].toLocaleDateString(
    "en-GB",
    options
  )} - ${dates[1].toLocaleDateString("en-GB", options)}`;
}
