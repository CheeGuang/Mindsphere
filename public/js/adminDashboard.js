// Define a standard color scheme
const colorScheme = [
  "rgba(75, 192, 192, 0.7)", // Aqua
  "rgba(54, 162, 235, 0.7)", // Blue
  "rgba(255, 99, 132, 0.7)", // Pink
  "rgba(255, 206, 86, 0.7)", // Yellow
  "rgba(153, 102, 255, 0.7)", // Purple
  "rgba(255, 159, 64, 0.7)", // Orange
];

document.addEventListener("DOMContentLoaded", async () => {
  const overallMetricsAPI = "/api/dashboard/";

  // Chart instances
  let totalRevenueChart,
    monthlySalesChart,
    topWorkshopsChart,
    topParticipantsChart,
    eventCountsChart,
    upcomingWorkshopsChart;

  // Adjust chart options
  function createChart(ctx, type, data, options = {}) {
    return new Chart(ctx, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: options.scales || {},
      },
    });
  }

  async function fetchOverallMetrics() {
    try {
      console.log("Fetching overall metrics...");
      const response = await fetch(overallMetricsAPI);

      if (!response.ok) {
        throw new Error(`Failed to fetch overall metrics: ${response.status}`);
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("No data received for overall metrics.");
      }

      console.log("Overall metrics fetched:", data);

      // Make membership data globally accessible for prepareRecipientEmails
      window.data = data;

      // Populate Overall Metrics Charts
      createTotalRevenueChart(data.totalRevenue);
      createMonthlySalesChart(data.currentVsLastMonthSales);
      createTopWorkshopsChart(data.topWorkshops);
      createTopParticipantsChart(data.topParticipants);
      createEventCountsChart(data.eventCounts);

      // Populate Expiring Memberships Chart
      populateMembershipList(
        "expiringMembershipsChart",
        data.expiringMemberships,
        "Expiring Mind+ Members"
      );

      // Populate Members with No End Date Chart
      populateMembershipList(
        "nullMembershipsChart",
        data.membersWithNoEndDate,
        "Non Mind+ Members"
      );

      // Create Mind+ Status Chart
      createMindPlusStatusChart(data);
    } catch (error) {
      console.error("Error fetching overall metrics:", error);
    }
  }

  function populateMembershipList(containerId, memberships, title) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Container with ID '${containerId}' not found.`);
      return;
    }

    if (!memberships || memberships.length === 0) {
      container.innerHTML = `
      <div class="card shadow-sm p-3 d-flex flex-column h-100">
        <h5 class="text-center text-secondary">${title}</h5>
        <p class="text-center flex-grow-1">No data available.</p>
        <button
          id="${containerId}-btn"
          class="btn w-100 mt-auto"
          data-bs-toggle="modal"
          data-bs-target="#bulkEmailModal"
        >
          Send Bulk Email
        </button>
      </div>`;
      document
        .getElementById(`${containerId}-btn`)
        .classList.add("btn-primary", "btn-lg", "shadow-sm");
      return;
    }

    const content = memberships
      .map((member) => {
        const firstName = member.firstName || "Unknown First Name";
        const lastName = member.lastName || "Unknown Last Name";
        const email = member.email || "Unknown Email";

        // Format membership end date
        const membershipEndDateLine = member.membershipEndDate
          ? `<br> ${new Date(member.membershipEndDate).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )}`
          : "";

        return `<p><strong>${firstName} ${lastName}</strong>: ${email}${membershipEndDateLine}</p>`;
      })
      .join("");

    container.innerHTML = `
    <div class="card shadow-sm p-3 d-flex flex-column h-100">
      <h5 class="text-center text-secondary">${title}</h5>
      <div class="fw-normal flex-grow-1 overflow-auto">${content}</div>
      <button
        id="${containerId}-btn"
        class="btn w-100 mt-auto"
        data-bs-toggle="modal"
        data-bs-target="#bulkEmailModal"
        onclick="prepareRecipientEmails('expiringMembershipsChart')"
      >
        Send Bulk Email
      </button>
    </div>`;

    document
      .getElementById(`${containerId}-btn`)
      .classList.add("btn-primary", "btn-lg", "shadow-sm");
  }

  function prepareRecipientEmails(type) {
    console.log("Preparing recipient emails for type:", type);
    const memberships =
      type === "expiringMembershipsChart"
        ? window.data.expiringMemberships
        : type === "nullMembershipsChart"
        ? window.data.membersWithNoEndDate
        : [];

    if (!memberships || memberships.length === 0) {
      console.error(`No memberships found for type: ${type}`);
      return;
    }

    // Prepare recipient emails
    window.recipientEmails = memberships.reduce((acc, member) => {
      if (member.email)
        acc[member.email] = `${member.firstName} ${member.lastName}`;
      return acc;
    }, {});

    console.log("Recipient emails prepared:", window.recipientEmails);
  }

  console.log("Hi");
  // Attach to global scope
  window.prepareRecipientEmails = prepareRecipientEmails;

  // Add a new chart instance for Mind+ Status
  let mindPlusStatusChart;

  function createMindPlusStatusChart(data) {
    const ctx = document.getElementById("mindPlusStatusChart").getContext("2d");
    if (mindPlusStatusChart) mindPlusStatusChart.destroy();

    mindPlusStatusChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["No Mind+", "Mind+"],
        datasets: [
          {
            data: [data.membersWithNullEndDate, data.membersWithEndDate],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)", // Red for No Mind+
              "rgba(54, 162, 235, 0.7)", // Blue for Mind+
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }

  // Individual chart creation functions

  function createTotalRevenueChart(data) {
    const ctx = document.getElementById("totalRevenueChart").getContext("2d");
    if (totalRevenueChart) totalRevenueChart.destroy();

    totalRevenueChart = createChart(ctx, "line", {
      labels: data.map((item) => item.MonthYear),
      datasets: [
        {
          label: "Total Revenue",
          data: data.map((item) => item.TotalRevenue),
          borderColor: colorScheme[0],
          backgroundColor: colorScheme[0],
          fill: true,
        },
      ],
    });
  }

  function createMonthlySalesChart(data) {
    const ctx = document.getElementById("monthlySalesChart").getContext("2d");
    if (monthlySalesChart) monthlySalesChart.destroy();

    monthlySalesChart = createChart(ctx, "bar", {
      labels: ["Current Month", "Last Month"],
      datasets: [
        {
          label: "Sales Revenue",
          data: [
            data.CurrentMonthSalesRevenue || 0,
            data.LastMonthSalesRevenue || 0,
          ],
          backgroundColor: [colorScheme[1], colorScheme[2]],
        },
      ],
    });
  }

  function createTopWorkshopsChart(data) {
    const ctx = document.getElementById("topWorkshopsChart").getContext("2d");
    if (topWorkshopsChart) topWorkshopsChart.destroy();

    // Prepare labels and tooltips
    const labels = data.map((item) =>
      item.WorkshopTitle.length > 15
        ? item.WorkshopTitle.substring(0, 15) + "..." // Truncate long names
        : item.WorkshopTitle
    );
    const fullLabels = data.map((item) => item.WorkshopTitle); // Store full names for tooltips

    // Chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: "Total Participants",
          data: data.map((item) => item.TotalParticipants),
          backgroundColor: [
            "rgba(75, 192, 192, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
          ],
        },
      ],
    };

    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const index = tooltipItems[0].dataIndex; // Get the hovered data index
              return fullLabels[index]; // Return full name
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Workshops",
          },
          ticks: {
            autoSkip: false, // Ensure all labels display
            maxRotation: 0, // Keep labels horizontal
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Participants",
          },
        },
      },
    };

    // Create the chart
    topWorkshopsChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  function createTopParticipantsChart(data) {
    const ctx = document
      .getElementById("topParticipantsChart")
      .getContext("2d");
    if (topParticipantsChart) topParticipantsChart.destroy();

    // Prepare labels and tooltips
    const labels = data.map((item) =>
      item.ParticipantName.length > 15
        ? item.ParticipantName.substring(0, 15) + "..." // Truncate long names
        : item.ParticipantName
    );
    const fullLabels = data.map((item) => item.ParticipantName); // Store full names for tooltips

    // Chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: "Attendance Count",
          data: data.map((item) => item.AttendanceCount),
          backgroundColor: colorScheme[3],
        },
      ],
    };

    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // Horizontal bar chart
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const index = tooltipItems[0].dataIndex; // Get the hovered data index
              return fullLabels[index]; // Return full name
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Attendance Count",
          },
        },
        y: {
          title: {
            display: true,
            text: "Participants",
          },
          ticks: {
            autoSkip: false, // Ensure all labels display
            maxRotation: 0, // Keep labels horizontal
            minRotation: 0,
          },
        },
      },
    };

    // Create the chart
    topParticipantsChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  function createEventCountsChart(data) {
    const ctx = document.getElementById("eventCountsChart").getContext("2d");
    if (eventCountsChart) eventCountsChart.destroy();

    eventCountsChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Completed Events", "Upcoming Events"],
        datasets: [
          {
            label: "Event Counts",
            data: [data.CompletedEvents || 0, data.UpcomingEvents || 0],
            backgroundColor: [
              "rgba(75, 192, 75, 0.7)", // Green for Completed Events
              "rgba(75, 192, 192, 0.7)", // Aqua for Upcoming Events
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }

  // Initial fetch
  fetchOverallMetrics();

  const getAllEventsAPI = "/api/event/get-all-event";
  const eventMetricsAPI = "/api/dashboard/event/";

  const workshopSelector = document.getElementById("workshopSelector");

  // Chart instances
  let participantInterestsChart, dietaryPreferencesChart;

  // Fetch all events for the dropdown
  async function fetchAllEvents() {
    try {
      console.log("Fetching all events for the dropdown...");
      const response = await fetch(getAllEventsAPI);

      if (!response.ok) {
        throw new Error("Failed to fetch events for dropdown");
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No events data received for dropdown");
      }

      console.log("Events fetched:", data);

      // Populate the dropdown
      workshopSelector.innerHTML = data
        .map(
          (event) =>
            `<option value="${event.eventID}">${event.title} (${event.type})</option>`
        )
        .join("");

      // Fetch metrics for the first event by default
      if (data.length > 0) fetchEventMetrics(data[0].eventID);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  // Fetch Event-Specific Metrics
  async function fetchEventMetrics(eventID) {
    try {
      console.log(`Fetching event metrics for EventID: ${eventID}...`);
      const response = await fetch(`${eventMetricsAPI}${eventID}`);

      if (!response.ok) {
        throw new Error("Failed to fetch event metrics");
      }

      const { data } = await response.json();

      if (!data) {
        throw new Error("No data received for event metrics");
      }

      console.log("Event metrics fetched:", data);

      // Display Total Revenue
      document.getElementById(
        "totalRevenue"
      ).innerText = `S$${data.totalRevenue.toLocaleString()}`;

      // Update Participant Interests Chart
      createParticipantInterestsChart(data.participantInterests);

      // Update Dietary Preferences Chart
      createDietaryPreferencesChart(data.dietaryPreferences);

      // New charts for participant feedback
      createExperienceChart(data.participantFeedback);
      createPaceChart(data.participantFeedback);

      displayFeedbackCards(data.participantFeedback);

      // Display Event Timing and Venue
      document.getElementById(
        "eventTimingVenue"
      ).innerText = `${data.eventTimingVenue.EventTiming}\n${data.eventTimingVenue.EventVenue}`;

      // Display Total Participants
      document.getElementById(
        "totalParticipants"
      ).innerText = `${data.totalParticipants}`;

      // Assuming data.upcomingDates is a comma-separated string of dates
      const upcomingDates = data.upcomingDates.split(",");

      // Format the dates as DD-MMM-YYYY and join them with " - "
      const formattedDates = upcomingDates
        .map((date) => {
          const formattedDate = new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
          return formattedDate;
        })
        .join(" - ");

      // Display the formatted dates
      document.getElementById("upcomingDates").innerText = formattedDates;

      // Display Average Age
      document.getElementById(
        "averageAge"
      ).innerText = `${data.averageAge.toFixed(2)}`;

      // Display Event Status
      document.getElementById("eventStatus").innerText = `${data.eventStatus}`;
    } catch (error) {
      console.error("Error fetching event metrics:", error);
    }
  }

  // Create Participant Interests Chart
  function createParticipantInterestsChart(data) {
    const ctx = document
      .getElementById("participantInterestsChart")
      ?.getContext("2d");
    if (!ctx) {
      console.error("Canvas for Participant Interests Chart not found.");
      return;
    }
    if (participantInterestsChart) participantInterestsChart.destroy();

    // Group data by interests and prepare datasets for chart
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.interests]) acc[item.interests] = {};
      acc[item.interests][item.age] =
        (acc[item.interests][item.age] || 0) + item.ParticipantCount;
      return acc;
    }, {});

    const uniqueAges = Array.from(new Set(data.map((item) => item.age))).sort(
      (a, b) => a - b
    );
    const uniqueInterests = Object.keys(groupedData);

    // Truncated labels for x-axis
    const labels = uniqueInterests.map((interest) =>
      interest.length > 15 ? interest.substring(0, 15) + "..." : interest
    );
    const fullLabels = uniqueInterests; // Store full names for tooltips

    // Prepare datasets for chart
    const datasets = uniqueAges.map((age, index) => ({
      label: `Age ${age}`,
      data: uniqueInterests.map((interest) => groupedData[interest][age] || 0),
      backgroundColor: colorScheme[index % colorScheme.length],
    }));

    // Create the chart
    participantInterestsChart = createChart(
      ctx,
      "bar",
      {
        labels,
        datasets,
      },
      {
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return fullLabels[index]; // Show full label on hover
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Interests",
            },
            ticks: {
              autoSkip: false, // Ensure all labels are shown
              callback: (value, index) => labels[index], // Show truncated label
              maxRotation: 0, // Keep labels horizontal
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Participant Count",
            },
            ticks: {
              stepSize: 1, // Set intervals to integers
              callback: (value) => (Number.isInteger(value) ? value : ""), // Show only integer ticks
            },
          },
        },
      }
    );
  }

  // Create Dietary Preferences Chart
  function createDietaryPreferencesChart(data) {
    const ctx = document
      .getElementById("dietaryPreferencesChart")
      ?.getContext("2d");
    if (!ctx) {
      console.error("Canvas for Dietary Preferences Chart not found.");
      return;
    }
    if (dietaryPreferencesChart) dietaryPreferencesChart.destroy();

    dietaryPreferencesChart = createChart(ctx, "pie", {
      labels: data.map((item) => item.DietaryPreference),
      datasets: [
        {
          data: data.map((item) => item.PreferenceCount),
          backgroundColor: colorScheme.slice(0, 5),
        },
      ],
    });
  }

  // Add Event Listener for Dropdown
  workshopSelector.addEventListener("change", (e) => {
    const eventID = e.target.value;
    fetchEventMetrics(eventID);
  });

  // Initialize Fetches
  fetchAllEvents();

  let experienceChart, paceChart;

  // Function to create or update the Experience Chart
  function createExperienceChart(data) {
    const ctx = document.getElementById("experienceChart").getContext("2d");
    if (experienceChart) experienceChart.destroy();

    experienceChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Bad", "Normal", "Excellent"],
        datasets: [
          {
            data: [
              data.filter((item) => item.experience === 1).length, // Bad
              data.filter((item) => item.experience === 2).length, // Normal
              data.filter((item) => item.experience === 3).length, // Excellent
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)", // Pink for Bad
              "rgba(54, 162, 235, 0.7)", // Blue for Normal
              "rgba(75, 192, 192, 0.7)", // Aqua for Excellent
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }

  // Function to create or update the Pace Chart
  function createPaceChart(data) {
    const ctx = document.getElementById("paceChart").getContext("2d");
    if (paceChart) paceChart.destroy();

    paceChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Slow", "Just Right", "Fast"],
        datasets: [
          {
            data: [
              data.filter((item) => item.pace === 1).length, // Slow
              data.filter((item) => item.pace === 2).length, // Just Right
              data.filter((item) => item.pace === 3).length, // Fast
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)", // Pink for Slow
              "rgba(54, 162, 235, 0.7)", // Blue for Just Right
              "rgba(255, 206, 86, 0.7)", // Yellow for Fast
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }

  function displayFeedbackCards(feedbackData) {
    const likedFeedbacks = feedbackData.map((item) => item.liked).join("<br>");
    const dislikedFeedbacks = feedbackData
      .map((item) => item.disliked)
      .join("<br>");
    const additionalComments = feedbackData
      .map((item) => item.additionalComments)
      .join("<br>");

    const feedbackContainer = document.getElementById("feedbackContainer");
    feedbackContainer.innerHTML = `
      <div class="row my-3">
        <div class="col-md-4">
          <div class="card shadow-sm p-3" style="max-height: 300px; overflow-y: auto;">
            <h5 class="text-center text-secondary">Liked Feedbacks</h5>
            <p class="fw-normal">${likedFeedbacks}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm p-3" style="max-height: 300px; overflow-y: auto;">
            <h5 class="text-center text-secondary">Disliked Feedbacks</h5>
            <p class="fw-normal">${dislikedFeedbacks}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm p-3" style="max-height: 300px; overflow-y: auto;">
            <h5 class="text-center text-secondary">Additional Comments</h5>
            <p class="fw-normal">${additionalComments}</p>
          </div>
        </div>
      </div>
    `;
  }
});

function sendBulkEmail() {
  // Collect the message and recipientEmails from modal fields
  const textMessage = document.getElementById("bulkEmailMessage").value;

  if (!textMessage) {
    showCustomAlert("Please enter a message before sending!");
    return;
  }

  // Use `window.recipientEmails` to access the globally set recipient emails
  const recipientEmails = window.recipientEmails;

  console.log(recipientEmails);

  if (!recipientEmails || Object.keys(recipientEmails).length === 0) {
    showCustomAlert("No recipients found for bulk email!");
    return;
  }

  console.log("Sending bulk email with the following data:");
  console.log("Recipient Emails:", recipientEmails);
  console.log("Message:", textMessage);

  // Perform the API call to send the bulk email
  fetch("/api/emailService/send-bulk-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipientEmails, textMessage }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to send emails");
      return response.json();
    })
    .then((data) => {
      console.log("Bulk email sent successfully:", data);
      showCustomAlert("Emails sent successfully!");
      // Close the modal after successful email sending
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("bulkEmailModal")
      );
      modal.hide();
    })
    .catch((error) => {
      console.error("Error sending bulk email:", error);
      showCustomAlert("Failed to send emails. Please try again.");
    });
}

// Attach to global scope
window.sendBulkEmail = sendBulkEmail;
