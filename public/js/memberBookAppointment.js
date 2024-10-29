document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("custom-calendar");
  let selectedTimeSlots = {};
  let selectedDay = null;
  let selectedCoach = null;
  let coachAvailability = {};

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

  // Function to format availability dates from JSON string to local date (SGT)
  function formatAvailability(availabilityJSON) {
    try {
      const availabilityArray = JSON.parse(availabilityJSON);
      const formattedDates = availabilityArray.map((item) => {
        const date = new Date(item.utcDateTime);
        return {
          localDate: new Date(date.getTime() + 8 * 60 * 60 * 1000), // Convert UTC to SGT
          utcDateTime: item.utcDateTime,
        };
      });
      return formattedDates;
    } catch (error) {
      console.error("Error parsing availability:", error);
      return [];
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

      // Store availability in the global variable for each coach
      coachAvailability[coach.firstName.toLowerCase()] = formatAvailability(
        coach.availability
      );

      // Create the coach card
      rowContent += `
        <div class="col-md-3 mb-3">
          <div class="card coach-card d-flex align-items-center p-3" data-coach="${coach.firstName.toLowerCase()}" data-adminId="${
        coach.adminID
      }">
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

      // Set the selected coach
      selectedCoach = $(this).data("coach");
      selectedadminId = $(this).data("adminid");

      // Reset selected availability when a new coach is selected
      selectedTimeSlots = {};
      selectedDay = null;
      updateSelectedDayDisplay();

      // Render the calendar with the selected coach's availability
      renderMonthCalendar(currentMonth);
    });
  }

  // Fetch and display the coaches when the page is ready
  fetchCoachesData();

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
        const availableClass = isCoachAvailableOnDate(fullDate)
          ? "available-day"
          : "";

        // Check if the date is currently selected
        const selectedClass = selectedDay === fullDate ? "selected-date" : "";

        currentRowHTML += `<td class="calendar-day ${pastClass} ${availableClass} ${selectedClass}" data-date="${fullDate}">${dayCounter}</td>`;
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
          const availableClass = isCoachAvailableOnDate(fullDate)
            ? "available-day"
            : "";

          // Check if the date is currently selected
          const selectedClass = selectedDay === fullDate ? "selected-date" : "";

          weekRowHTML += `<td class="calendar-day ${pastClass} ${availableClass} ${selectedClass}" data-date="${fullDate}">${dayCounter}</td>`;
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
      if (
        !cell.classList.contains("past-date") &&
        cell.classList.contains("available-day")
      ) {
        cell.addEventListener("click", function () {
          selectedDay = cell.dataset.date;
          openTimeSlotModal(selectedDay);
        });
      }
    });
  }

  // Update the selected day display on the calendar
  function updateSelectedDayDisplay() {
    document.querySelectorAll(".calendar-day").forEach((cell) => {
      if (cell.dataset.date !== selectedDay) {
        cell.classList.remove("selected-date");
      }
    });
  }

  // Check if the selected coach is available on the given date
  function isCoachAvailableOnDate(date) {
    if (!selectedCoach || !coachAvailability[selectedCoach]) return false;
    return coachAvailability[selectedCoach].some(
      (availability) =>
        availability.localDate.toISOString().slice(0, 10) === date
    );
  }

  // Open modal for time slot selection
  function openTimeSlotModal(date) {
    const timeSlotContainer = document.getElementById("time-slot-container");
    timeSlotContainer.innerHTML = ""; // Clear previous slots

    // Get selected coach's availability for the chosen date
    const availableSlots = getAvailableSlotsForDate(date);

    // Create slots for available hours
    availableSlots.forEach((slot) => {
      // Subtract 8 hours from the slot date time
      const slotDate = new Date(slot.localDate);
      slotDate.setHours(slotDate.getHours() - 8); // Adjust time by -8 hours
      const hour = slotDate.getHours();

      const timeSlot = document.createElement("div");
      timeSlot.className = `col-3 mb-2 time-slot available-slot`;
      timeSlot.dataset.hour = hour;
      timeSlot.textContent = formatHour(hour);

      // Check if this slot is already selected for this date
      if (selectedTimeSlots[date] && selectedTimeSlots[date].includes(hour)) {
        timeSlot.classList.add("selected-slot");
      }

      timeSlot.addEventListener("click", function () {
        // Reset previously selected slots (only 1 slot allowed)
        resetSelectedTimeSlots(date);
        updateSelectedDayDisplay();
        toggleSlotSelection(timeSlot, date, hour);
      });

      timeSlotContainer.appendChild(timeSlot);
    });

    // Show the modal
    new bootstrap.Modal(document.getElementById("timeSlotModal")).show();
  }

  // Reset selected time slots for dates other than the newly selected date
  function resetSelectedTimeSlots(newlySelectedDate) {
    Object.keys(selectedTimeSlots).forEach((date) => {
      if (date !== newlySelectedDate) {
        // Reset time slots for dates that are not the newly selected date
        selectedTimeSlots[date] = [];
      }
    });

    // Update UI to remove the 'selected-slot' class for all other dates
    document.querySelectorAll(".time-slot").forEach((slot) => {
      const slotDate = slot.closest(".calendar-day")?.dataset.date;
      if (slotDate && slotDate !== newlySelectedDate) {
        slot.classList.remove("selected-slot");
      }
    });
  }

  // Get available slots for the selected date
  function getAvailableSlotsForDate(date) {
    if (!selectedCoach || !coachAvailability[selectedCoach]) return [];
    return coachAvailability[selectedCoach].filter(
      (availability) =>
        availability.localDate.toISOString().slice(0, 10) === date
    );
  }

  // Toggle time slot selection
  function toggleSlotSelection(slotElement, date, hour) {
    // Only allow selection of available slots
    if (!slotElement.classList.contains("available-slot")) return;

    slotElement.classList.toggle("selected-slot");
    if (!selectedTimeSlots[date]) selectedTimeSlots[date] = [];

    if (slotElement.classList.contains("selected-slot")) {
      selectedTimeSlots[date].push(hour);
    } else {
      selectedTimeSlots[date] = selectedTimeSlots[date].filter(
        (h) => h !== hour
      );
    }

    // Update calendar cell background if a slot is selected
    updateCalendarCell(date);

    // Display selected time slot info
    showSelectedTimeSlot();
  }

  // Update calendar cell background based on availability
  function updateCalendarCell(date) {
    const cell = document.querySelector(`.calendar-day[data-date="${date}"]`);
    if (cell) {
      if (isDateAvailable(date)) {
        cell.classList.add("selected-date");
      } else {
        cell.classList.remove("selected-date");
      }
    }
  }

  // Check if a date has any available time slots
  function isDateAvailable(date) {
    return selectedTimeSlots[date] && selectedTimeSlots[date].length > 0;
  }

  // Display the selected time slot information
  function showSelectedTimeSlot() {
    const selectedDate = Object.keys(selectedTimeSlots)[0];
    const selectedHour = selectedTimeSlots[selectedDate]
      ? selectedTimeSlots[selectedDate][0]
      : null;

    if (selectedDate && selectedHour !== null) {
      const formattedTime = formatHour(selectedHour);
      const formattedDate = new Date(selectedDate).toLocaleDateString();

      console.log(`Selected Time Slot: ${formattedDate} at ${formattedTime}`);
    }
  }

  // Format hours for AM/PM display
  function formatHour(hour) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${suffix}`;
  }

  document
    .getElementById("book-now-btn")
    .addEventListener("click", async function () {
      const button = this;
      // Disable the button to prevent multiple clicks
      button.disabled = true;

      const selectedDate = Object.keys(selectedTimeSlots)[0];
      const selectedHour = selectedTimeSlots[selectedDate]
        ? selectedTimeSlots[selectedDate][0]
        : null;
      const requestDescription =
        document.getElementById("requestDescription").value;

      // Retrieve memberID from localStorage
      const memberDetails = JSON.parse(localStorage.getItem("memberDetails"));
      const memberID = memberDetails ? memberDetails.memberID : null;

      // Retrieve the adminID of the selected coach
      const adminID = selectedadminId;

      if (selectedDate && selectedHour !== null && memberID && adminID) {
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(selectedHour, 0, 0); // Set hour and minutes to the selected hour

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 1); // Add 1 hour for end time

        const bookingDetails = {
          memberID: memberID,
          adminID: adminID,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          ParticipantURL: "https://example.com/participant", // Example URL
          HostRoomURL: "https://example.com/host", // Example URL
          requestDescription: requestDescription || "No description provided.",
        };

        try {
          // Send booking details to the backend
          const response = await fetch(
            `${window.location.origin}/api/appointment/create-appointment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bookingDetails),
            }
          );

          if (response.ok) {
            // Show success alert
            showCustomAlert("Appointment successfully scheduled!");

            // Redirect to memberAppointments.html after 3 seconds
            setTimeout(() => {
              window.location.href = "memberAppointments.html";
            }, 3000);
          } else {
            console.error("Failed to create appointment:", response.statusText);
            button.disabled = false; // Re-enable the button if there was an error
          }
        } catch (error) {
          console.error("Error creating appointment:", error);
          button.disabled = false; // Re-enable the button if there was an error
        }
      } else {
        console.log(
          "Missing required information (time slot, description, memberID, or adminID)."
        );
        button.disabled = false; // Re-enable the button if there was missing information
      }
    });
});
