document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("custom-calendar");
  const selectedTimeSlots = {};
  let selectedDay = null;
  let isDragging = false;

  // HTML element for displaying the selected timeslot summary
  const summaryContainer = document.getElementById("timeslot-summary");

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

  // Set the button labels to the actual month names
  document.getElementById("current-month-btn").textContent =
    monthNames[currentMonth.getMonth()];
  document.getElementById("next-month-btn").textContent =
    monthNames[nextMonth.getMonth()];

  // Render the current month by default
  renderMonthCalendar(currentMonth);

  // Check for admin details in localStorage after initialization
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  if (adminDetails && adminDetails.availability) {
    const availabilityData = JSON.parse(adminDetails.availability);
    preloadAvailability(availabilityData);
  }

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

  // Function to update timeslot summary, grouping by date and organizing in rows
  function updateTimeslotSummary() {
    summaryContainer.innerHTML = ""; // Clear previous summary

    // Group dates and format
    const dates = Object.keys(selectedTimeSlots).sort();
    let rowContainer = null; // To hold groups of up to five dates per row

    dates.forEach((date, index) => {
      const hours = selectedTimeSlots[date].sort((a, b) => a - b);
      if (hours.length > 0) {
        // Create a date container
        const dateContainer = document.createElement("div");
        dateContainer.className = "col mb-3"; // Use Bootstrap column classes for grid layout

        // Format the date as "10 Nov 2024 (Thu)"
        const dateObj = new Date(date);
        const day = dateObj.getDate().toString().padStart(2, "0"); // Ensure day is two digits
        const month = dateObj.toLocaleString("en-GB", { month: "short" }); // Short month name
        const year = dateObj.getFullYear();
        const weekday = dateObj.toLocaleString("en-GB", { weekday: "short" }); // Short weekday name
        const formattedDate = `${day} ${month} ${year} (${weekday})`;

        const dateHeader = document.createElement("h5");
        dateHeader.className = "fw-bold mb-2 text-center";
        dateHeader.textContent = formattedDate;
        dateContainer.appendChild(dateHeader);

        // Create a list of timeslots for this date
        const timeList = document.createElement("ul");
        timeList.className = "list-group list-group-flush";
        hours.forEach((hour) => {
          const startTime = formatHour(hour);
          const endTime = formatHour(hour + 1);

          const listItem = document.createElement("li");
          listItem.className = "list-group-item text-center";
          listItem.textContent = `${startTime} - ${endTime}`;
          timeList.appendChild(listItem);
        });

        dateContainer.appendChild(timeList);

        // Add the date container to a new row every five dates
        if (index % 5 === 0) {
          rowContainer = document.createElement("div");
          rowContainer.className = "row"; // Create a new row every five dates
          summaryContainer.appendChild(rowContainer);
        }

        rowContainer.appendChild(dateContainer); // Add the date container to the current row
      }
    });
  }

  // Function to format hours as AM/PM
  function formatHour(hour) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${suffix}`;
  }

  // Call updateTimeslotSummary on page load to display existing selections
  updateTimeslotSummary();

  // Rest of your existing code for toggleSlotSelection, autoSelectTimeSlots, etc.
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

    // Update the summary
    updateTimeslotSummary();
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

  // Preload availability from adminDetails
  function preloadAvailability(availabilityData) {
    availabilityData.forEach((slot) => {
      const slotDate = new Date(slot.utcDateTime);
      const localDate = slotDate.toLocaleDateString("en-SG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const dateString = localDate.split("/").reverse().join("-");
      const hour = slotDate.getHours();

      if (!selectedTimeSlots[dateString]) selectedTimeSlots[dateString] = [];
      if (!selectedTimeSlots[dateString].includes(hour)) {
        selectedTimeSlots[dateString].push(hour);
      }
    });

    // Re-render calendar to update marked availability
    renderMonthCalendar(currentMonth);
  }

  // Handle 'Done' button click
  document
    .getElementById("done-button")
    .addEventListener("click", async function () {
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

      try {
        // Send PUT request to update admin availability
        const response = await fetch("/api/admin/update-admin-availability", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminID: adminDetails.adminID,
            newAvailability: JSON.stringify(utcTimeSlots),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update availability.");
        }

        // Fetch admin details upon successful availability update
        await fetchAdminDetails(
          adminDetails.adminID,
          "../adminAppointments.html"
        );

        // Show success message
        showCustomAlert("Availability updated successfully!");
      } catch (error) {
        console.error("Error updating availability:", error);
        showCustomAlert("Failed to update availability. Please try again.");
      }
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

    // Update summary after auto-select
    updateTimeslotSummary();
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

// Function to fetch admin details by adminID and store them in localStorage as a single JSON object
function fetchAdminDetails(adminID, redirectUrl) {
  fetch(`/api/admin/admin-details/${adminID}`)
    .then((response) => response.json())
    .then((adminDetails) => {
      // Store admin details directly in localStorage under the key 'adminDetails'
      localStorage.setItem("adminDetails", JSON.stringify(adminDetails.data));

      // Wait for 3 seconds before redirecting
      setTimeout(() => {
        // Redirect to the appropriate page
        window.location.href = redirectUrl;
      }, 3000); // 3000 milliseconds = 3 seconds
    })
    .catch((error) => {
      console.error("Error fetching admin details:", error);
    });
}
