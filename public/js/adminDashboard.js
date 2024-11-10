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

  // Fetch Overall Metrics
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

      // Populate Overall Metrics Charts
      createTotalRevenueChart(data.totalRevenue);
      createMonthlySalesChart(data.currentVsLastMonthSales);
      createTopWorkshopsChart(data.topWorkshops);
      createTopParticipantsChart(data.topParticipants);
      createEventCountsChart(data.eventCounts);
      createUpcomingWorkshopsChart(data.upcomingWorkshops);
    } catch (error) {
      console.error("Error fetching overall metrics:", error);
    }
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

    eventCountsChart = createChart(ctx, "pie", {
      labels: ["Completed Events", "Upcoming Events"],
      datasets: [
        {
          label: "Event Counts",
          data: [data.CompletedEvents || 0, data.UpcomingEvents || 0],
          backgroundColor: [colorScheme[4], colorScheme[5]],
        },
      ],
    });
  }

  function createUpcomingWorkshopsChart(data) {
    const ctx = document
      .getElementById("upcomingWorkshopsChart")
      .getContext("2d");
    if (upcomingWorkshopsChart) upcomingWorkshopsChart.destroy();

    upcomingWorkshopsChart = createChart(ctx, "doughnut", {
      labels: data.map((item) => item.WorkshopType),
      datasets: [
        {
          label: "Upcoming Workshops",
          data: data.map((item) => item.UpcomingWorkshops),
          backgroundColor: colorScheme.slice(0, 4),
        },
      ],
    });
  }

  // Initial fetch
  fetchOverallMetrics();

  // Initial Fetch
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
});
