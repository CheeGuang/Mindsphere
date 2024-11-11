document.addEventListener("DOMContentLoaded", function () {
  // Show the modal when the page loads
  const instructionModal = new bootstrap.Modal(
    document.getElementById("instructionModal"),
    {
      keyboard: true,
    }
  );
  instructionModal.show();
});

// Attach the event listener to the modal
$("#instructionModal").on("hidden.bs.modal", function () {
  // Check if memberDetails exist in localStorage
  if (!localStorage.getItem("memberDetails")) {
    // Redirect to memberLogin.html
    window.location.href = "memberLogin.html";
  }
});

let mediaRecorder;
let audioChunks = [];
let trackingInterval;
let trackingStartTime;

const emotionDurations = {
  happy: 0,
  sad: 0,
  fearful: 0,
  angry: 0,
  neutral: 0,
  disgusted: 0,
  surprised: 0,
};

const colorScheme = {
  happy: "rgba(255, 206, 86, 0.7)", // Yellow
  sad: "rgba(54, 162, 235, 0.7)", // Blue
  fearful: "rgba(153, 102, 255, 0.7)", // Purple
  angry: "rgba(255, 99, 132, 0.7)", // Pink
  neutral: "rgba(201, 203, 207, 0.7)", // Grey
  disgusted: "rgba(255, 159, 64, 0.7)", // Orange
  surprised: "rgba(75, 192, 192, 0.7)", // Aqua
};

const audioPlayback = $("#audioPlayback");
const confirmButton = $("#confirmButton");
const recordingIndicator = $("#recordingIndicator");

audioPlayback[0].currentTime = 0;
audioPlayback.attr("src", "");

document.getElementById("startRecording").disabled = false;

$("#startRecording").click(async function () {
  audioChunks = [];
  resetEmotionDurations();
  emotionDataPoints = []; // Clear previous emotion data points
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.onstart = function () {
    recordingIndicator.show();
    audioPlayback.hide();
    confirmButton.prop("disabled", true);
    $("#stopRecording").prop("disabled", false);

    startEmotionTracking();
  };

  mediaRecorder.ondataavailable = function (event) {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async function () {
    stopEmotionTracking();
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

  // Change the startRecording button to a restart button
  const startButton = $("#startRecording");
  startButton.html('<i class="fas fa-redo me-2"></i> Restart');
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
      addEmotionLineChart();
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

// Emotion Tracking Functions
function startEmotionTracking() {
  trackingStartTime = Date.now();
  trackingInterval = setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    if (detections && detections.expressions) {
      const currentTime = (Date.now() - trackingStartTime) / 1000;
      recordEmotionDataPoint(currentTime, detections.expressions);
    }
  }, 1000); // Track emotions every second
}

function stopEmotionTracking() {
  clearInterval(trackingInterval);
}

function recordEmotionDataPoint(time, expressions) {
  const emotionPoint = {
    time,
    ...Object.keys(emotionDurations).reduce((acc, emotion) => {
      acc[emotion] = expressions[emotion] || 0;
      return acc;
    }, {}),
  };
  emotionDataPoints.push(emotionPoint);

  // Update cumulative emotion durations
  Object.keys(emotionDurations).forEach((emotion) => {
    cumulativeEmotionDurations[emotion] =
      (cumulativeEmotionDurations[emotion] || 0) + emotionPoint[emotion];
  });
}

function resetEmotionDurations() {
  Object.keys(emotionDurations).forEach((emotion) => {
    emotionDurations[emotion] = 0;
  });
  cumulativeEmotionDurations = {};
  emotionDataPoints = [];
}

function addEmotionLineChart() {
  const filteredEmotions = Object.keys(cumulativeEmotionDurations).filter(
    (emotion) => cumulativeEmotionDurations[emotion] > 5 // Only include emotions with cumulative duration > 5 seconds
  );

  if (filteredEmotions.length === 0) {
    console.log("No emotions existed for more than 5 seconds.");
    return;
  }

  const evaluationContainer = $("#evaluationResultsContainer");
  evaluationContainer.append(`
    <div class="card my-3">
      <div class="card-body">
        <h5 class="card-title">Your Emotions Over Time</h5>
        <canvas id="emotionsChart" width="400" height="200"></canvas>
      </div>
    </div>
  `);

  const ctx = document.getElementById("emotionsChart").getContext("2d");

  const labels = emotionDataPoints.map(
    (point) => Math.floor(point.time / 5) * 5 + "s"
  ); // Round to nearest 5s
  const datasets = filteredEmotions.map((emotion) => {
    return {
      label: emotion,
      data: emotionDataPoints.map((point) => point[emotion]),
      borderColor: colorScheme[emotion],
      backgroundColor: colorScheme[emotion], // Solid colour for the legend
      fill: false,
      tension: 0.1,
    };
  });

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true, // Optional: Makes the legend marker a circle
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(
                2
              )}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (s)",
          },
          ticks: {
            stepSize: 5, // X-axis intervals of 5 seconds
          },
        },
        y: {
          title: {
            display: true,
            text: "Emotion Intensity",
          },
          beginAtZero: true,
          ticks: {
            stepSize: 0.5, // Y-axis intervals of 0.5
          },
        },
      },
    },
  });
}

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
