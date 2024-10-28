document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("custom-calendar");
  const selectedTimeSlots = {};
  let selectedDay = null;
  let isDragging = false;

  // Get current and next month dates
  const currentDate = new Date();
  const currentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  // Month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Function to fetch all coaches' data from the server
  function fetchCoachesData() {
    fetch("/api/admin/get-all-admins")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Extract the coaches data
          const coachesData = data.data;
          // Display the coaches using the displayCoaches function
          displayCoaches(coachesData);
        } else {
          console.error("Failed to fetch coaches data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching coaches data:", error);
      });
  }

  // Function to format availability dates from JSON string
  function formatAvailability(availabilityJSON) {
    try {
      const availabilityArray = JSON.parse(availabilityJSON);
      // Map through the dates and format them as readable dates
      const formattedDates = availabilityArray.map((item) => {
        const date = new Date(item.utcDateTime);
        return date.toLocaleDateString();
      });
      return formattedDates.join(", ");
    } catch (error) {
      console.error("Error parsing availability:", error);
      return "Unavailable";
    }
  }

  // Function to dynamically display the coaches
  function displayCoaches(coaches) {
    const coachesSection = $("#coaches-section");
    let rowContent = "";

    coaches.forEach((coach, index) => {
      if (index % 4 === 0) {
        if (index !== 0) {
          // Close the previous row
          rowContent += `</div>`;
        }
        // Start a new row
        rowContent += `<div class="row justify-content-center mb-4">`;
      }

      // Format the availability dates
      const formattedAvailability = formatAvailability(coach.availability);

      // Create the coach card
      rowContent += `
        <div class="col-md-3 mb-3">
          <div class="card coach-card d-flex align-items-center p-3" data-coach="${coach.firstName.toLowerCase()}">
            <img
              src="${coach.profilePicture}"
              alt="Coach ${coach.firstName}"
              class="card-img-top coach-img"
            />
            <div class="card-body text-center">
              <h5 class="card-title">${coach.firstName} ${coach.lastName}</h5>
              <p class="card-text">${coach.bio}</p>
            </div>
          </div>
        </div>
      `;

      // If it's the last coach, close the row
      if (index === coaches.length - 1) {
        rowContent += `</div>`;
      }
    });

    // Append the generated content to the coaches section
    coachesSection.html(rowContent);

    // Add click event listener for selecting a coach
    $(".coach-card").on("click", function () {
      // Remove 'selected' class from all other cards
      $(".coach-card").removeClass("selected");

      // Add 'selected' class to the clicked card
      $(this).addClass("selected");
    });
  }

  // Fetch and display the coaches when the page is ready
  fetchCoachesData();

  // Get all coach cards
  const coachCards = document.querySelectorAll(".coach-card");

  // Add click event to each card
  coachCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove 'selected' class from all cards
      coachCards.forEach((c) => c.classList.remove("selected"));

      // Add 'selected' class to the clicked card
      this.classList.add("selected");
    });
  });

  // Set the button labels to the actual month names
  document.getElementById("current-month-btn").textContent =
    monthNames[currentMonth.getMonth()];
  document.getElementById("next-month-btn").textContent =
    monthNames[nextMonth.getMonth()];

  // Render the current month by default
  renderMonthCalendar(currentMonth);

  // Buttons for switching between current and next month
  document
    .getElementById("current-month-btn")
    .addEventListener("click", function () {
      renderMonthCalendar(currentMonth);
    });

  document
    .getElementById("next-month-btn")
    .addEventListener("click", function () {
      renderMonthCalendar(nextMonth);
    });

  // Render month view based on selected month
  function renderMonthCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Day of the week the month starts on (0 = Sunday)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month

    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for date-only comparison

    let calendarHTML = '<div class="table-responsive">';
    calendarHTML += '<table class="table table-bordered text-center">';
    calendarHTML += `<thead class="bg-light"><tr>${[
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]
      .map((day) => `<th>${day}</th>`)
      .join("")}</tr></thead><tbody>`;

    let dayCounter = 1;
    let currentRowHTML = "<tr>";

    // Fill the initial empty cells if the month doesn't start on Sunday
    for (let i = 0; i < firstDay; i++) {
      currentRowHTML += "<td></td>";
    }

    // Fill in the rest of the month days
    for (let day = firstDay; day < 7; day++) {
      if (dayCounter <= daysInMonth) {
        const fullDate = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(dayCounter).padStart(2, "0")}`;
        const cellDate = new Date(fullDate);

        // Check if the cell date is in the past
        const isPastDate = cellDate < today;
        const pastClass = isPastDate ? "past-date" : "";
        const availableClass = isDateAvailable(fullDate) ? "available-day" : "";

        currentRowHTML += `<td class="calendar-day ${pastClass} ${availableClass}" data-date="${fullDate}">${dayCounter}</td>`;
        dayCounter++;
      }
    }

    currentRowHTML += "</tr>";
    calendarHTML += currentRowHTML;

    // Continue filling rows until the month ends
    while (dayCounter <= daysInMonth) {
      let weekRowHTML = "<tr>";
      for (let day = 0; day < 7; day++) {
        if (dayCounter <= daysInMonth) {
          const fullDate = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(dayCounter).padStart(2, "0")}`;
          const cellDate = new Date(fullDate);

          // Check if the cell date is in the past
          const isPastDate = cellDate < today;
          const pastClass = isPastDate ? "past-date" : "";
          const availableClass = isDateAvailable(fullDate)
            ? "available-day"
            : "";

          weekRowHTML += `<td class="calendar-day ${pastClass} ${availableClass}" data-date="${fullDate}">${dayCounter}</td>`;
          dayCounter++;
        } else {
          weekRowHTML += "<td></td>";
        }
      }
      weekRowHTML += "</tr>";
      calendarHTML += weekRowHTML;
    }

    calendarHTML += "</tbody></table></div>";
    calendarContainer.innerHTML = calendarHTML;

    // Attach event listeners to each day cell
    document.querySelectorAll(".calendar-day").forEach((cell) => {
      if (!cell.classList.contains("past-date")) {
        cell.addEventListener("click", function () {
          selectedDay = cell.dataset.date;
          openTimeSlotModal(selectedDay);
        });
      }
    });
  }

  // Open modal for time slot selection
  function openTimeSlotModal(date) {
    const timeSlotContainer = document.getElementById("time-slot-container");
    timeSlotContainer.innerHTML = ""; // Clear previous slots

    // Get current date and time for comparison
    const now = new Date();

    // Create 1-hour slots from 6 AM to 11 PM
    for (let hour = 6; hour <= 23; hour++) {
      const timeSlotDate = new Date(
        `${date}T${String(hour).padStart(2, "0")}:00:00+08:00`
      );

      // Check if the time slot is in the past
      const isPastTime = timeSlotDate < now;
      const pastTimeClass = isPastTime ? "past-time" : "";

      const timeSlot = document.createElement("div");
      timeSlot.className = `col-3 mb-2 time-slot ${pastTimeClass}`;
      timeSlot.dataset.hour = hour;
      timeSlot.textContent = formatHour(hour);

      // Pre-select slots if they are already selected
      if (selectedTimeSlots[date] && selectedTimeSlots[date].includes(hour)) {
        timeSlot.classList.add("selected-slot");
      }

      // If the slot is in the past, skip attaching event listeners
      if (!isPastTime) {
        timeSlot.addEventListener("mousedown", function () {
          isDragging = true;
          toggleSlotSelection(timeSlot, date, hour);
        });

        timeSlot.addEventListener("mouseenter", function () {
          if (isDragging) toggleSlotSelection(timeSlot, date, hour);
        });

        timeSlot.addEventListener("mouseup", function () {
          isDragging = false;
        });
      }

      timeSlotContainer.appendChild(timeSlot);
    }

    // Show the modal
    new bootstrap.Modal(document.getElementById("timeSlotModal")).show();
  }

  // Toggle time slot selection
  function toggleSlotSelection(slotElement, date, hour) {
    slotElement.classList.toggle("selected-slot");
    if (!selectedTimeSlots[date]) selectedTimeSlots[date] = [];

    if (slotElement.classList.contains("selected-slot")) {
      selectedTimeSlots[date].push(hour);
    } else {
      selectedTimeSlots[date] = selectedTimeSlots[date].filter(
        (h) => h !== hour
      );
    }

    // Update calendar cell background if slots are selected
    updateCalendarCell(date);
  }

  // Update calendar cell background based on availability
  function updateCalendarCell(date) {
    const cell = document.querySelector(`.calendar-day[data-date="${date}"]`);
    if (cell) {
      if (isDateAvailable(date)) {
        cell.classList.add("available-day");
      } else {
        cell.classList.remove("available-day");
      }
    }
  }

  // Check if a date has any available time slots
  function isDateAvailable(date) {
    return selectedTimeSlots[date] && selectedTimeSlots[date].length > 0;
  }

  // Format hours for AM/PM display
  function formatHour(hour) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${suffix}`;
  }

  // Handle 'Done' button click
  document.getElementById("done-button").addEventListener("click", function () {
    // Convert selected time slots from SGT to UTC
    const utcTimeSlots = Object.entries(selectedTimeSlots)
      .map(([date, hours]) => {
        return hours.map((hour) => {
          const sgtDate = new Date(
            `${date}T${String(hour).padStart(2, "0")}:00:00+08:00`
          );
          return {
            utcDateTime: sgtDate.toISOString(),
          };
        });
      })
      .flat();

    // Output UTC time slots to the console
    console.log("Selected Availability in UTC:", utcTimeSlots);

    // Use custom alert instead of default alert
    showCustomAlert(
      "Availability saved successfully! Check the console for UTC times."
    );
  });

  // Function to select time slots based on a weekday, start and end time
  function autoSelectTimeSlots(dayOfWeek, startTime, endTime) {
    const months = [currentMonth, nextMonth];
    months.forEach((month) => {
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      // Iterate through each day of the current month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthIndex, day);
        if (
          date.getDay() === dayOfWeek &&
          date >= new Date().setHours(0, 0, 0, 0)
        ) {
          const formattedDate = `${year}-${String(monthIndex + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          // Auto-select time slots within the start and end time
          if (!selectedTimeSlots[formattedDate]) {
            selectedTimeSlots[formattedDate] = [];
          }

          for (let hour = startTime; hour <= endTime; hour++) {
            if (!selectedTimeSlots[formattedDate].includes(hour)) {
              selectedTimeSlots[formattedDate].push(hour);
            }
          }

          // Update calendar cell background if slots are selected
          updateCalendarCell(formattedDate);
        }
      }
    });
  }

  // Handle 'Auto Select' button click from the form
  document
    .getElementById("auto-select-btn")
    .addEventListener("click", function () {
      const dayOfWeek = parseInt(document.getElementById("dayOfWeek").value);
      const startTime = parseInt(document.getElementById("startTime").value);
      const endTime = parseInt(document.getElementById("endTime").value);

      if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
        showCustomAlert("Please enter valid start and end times.");
        return;
      }

      // Show a success message once the time slots are successfully auto-selected
      showCustomAlert("Time slots have been successfully selected!");

      autoSelectTimeSlots(dayOfWeek, startTime, endTime);
    });
});
