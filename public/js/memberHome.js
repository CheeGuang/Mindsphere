// Function to fetch events from the API and update the HTML
async function fetchAndDisplayEvents() {
  const memberId = JSON.parse(localStorage.getItem("memberDetails"))?.memberID;

  if (!memberId) {
    console.error("Error: Member ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(
      `/api/event/get-event-by-member-id/${memberId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const events = await response.json();

    // Get today's date and filter upcoming events
    const today = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.availableDates.split(",")[0].trim());
      return eventDate >= today;
    });

    // Sort upcoming events by date in ascending order
    upcomingEvents.sort(
      (a, b) =>
        new Date(a.availableDates.split(",")[0].trim()) -
        new Date(b.availableDates.split(",")[0].trim())
    );

    // Update the event count
    document.getElementById(
      "event-count"
    ).textContent = `${upcomingEvents.length} events upcoming`;

    // Get the container for event carousel items
    const eventCarouselContainer = document.getElementById(
      "event-carousel-container"
    );
    eventCarouselContainer.innerHTML = ""; // Clear existing content

    // Create carousel items in groups of three events
    for (let i = 0; i < upcomingEvents.length; i += 3) {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (i === 0) carouselItem.classList.add("active"); // Make the first item active

      // Create a row to hold up to three event cards
      const row = document.createElement("div");
      row.classList.add("row", "justify-content-center");

      // Add up to three event cards to the row
      for (let j = i; j < i + 3 && j < upcomingEvents.length; j++) {
        const event = upcomingEvents[j];
        const eventImageSrc = event.picture
          ? `${event.picture}`
          : "https://via.placeholder.com/150x150";

        const eventCard = document.createElement("div");
        eventCard.classList.add("col-md-4");
        eventCard.innerHTML = `
          <div class="card carousel-card mx-auto mb-4">
            <div class="card-body text-start">
              <div class="row align-items-center">
                <div class="col-3 text-start">
                  <img src="${eventImageSrc}" class="common-image" alt="${
          event.title
        } Image">
                </div>
                <div class="col-9">
                  <h5 class="card-title">${event.title}</h5>
                </div>
              </div>
              <div class="time-details mt-3">
                <p class="date-time"><strong>Date: </strong>${formatDateRange(
                  event.availableDates
                )}<br>
                  <strong>Time: </strong>${event.time}</p>
              </div>
              <p class="card-text"><strong>Address:</strong> ${event.venue}</p>
            </div>
          </div>
        `;
        row.appendChild(eventCard);
      }

      // Append the row with event cards to the carousel item
      carouselItem.appendChild(row);
      eventCarouselContainer.appendChild(carouselItem);
    }

    // Enable the carousel controls if there are more than three events
    if (upcomingEvents.length > 3) {
      document.querySelector(".carousel-control-prev").classList.add("active");
      document.querySelector(".carousel-control-next").classList.add("active");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Helper function to format the event date range
function formatDateRange(datesString) {
  const datesArray = datesString.split(",");
  const firstDate = new Date(datesArray[0].trim());
  const lastDate = new Date(datesArray[datesArray.length - 1].trim());

  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedFirstDate = firstDate.toLocaleDateString("en-GB", options);
  const formattedLastDate = lastDate.toLocaleDateString("en-GB", options);

  return datesArray.length > 1
    ? `${formattedFirstDate} - ${formattedLastDate}`
    : formattedFirstDate;
}
// Existing function to fetch and display events remains unchanged

// Function to fetch appointments from the API endpoint and update HTML
async function fetchAppointments() {
  const memberId = JSON.parse(localStorage.getItem("memberDetails"))?.memberID;

  if (!memberId) {
    console.error("Error: Member ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(`/api/appointment/member/${memberId}`);
    const data = await response.json();

    if (response.ok) {
      const appointments = data.appointments;

      // Update the appointment count
      document.getElementById(
        "appointment-count"
      ).textContent = `${appointments.length} appointments upcoming`;

      const coachingCarouselContainer = document.querySelector(
        "#coachingCarousel .carousel-inner"
      );
      coachingCarouselContainer.innerHTML = ""; // Clear existing content

      // Create carousel items in groups of three appointments
      for (let i = 0; i < appointments.length; i += 3) {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (i === 0) carouselItem.classList.add("active"); // Make the first item active

        // Create a row to hold up to three appointment cards
        const row = document.createElement("div");
        row.classList.add("row", "justify-content-start");

        // Add up to three appointment cards to the row
        for (let j = i; j < i + 3 && j < appointments.length; j++) {
          const appointment = appointments[j];
          const profilePicture =
            appointment.AdminProfilePicture ||
            "https://via.placeholder.com/150x150";

          const appointmentCard = document.createElement("div");
          appointmentCard.classList.add("col-md-4");
          appointmentCard.innerHTML = `
      <div class="card carousel-card mx-auto mb-4">
        <div class="card-body text-start">
          <div class="row align-items-center">
            <div class="col-3 text-start">
              <img src="${profilePicture}" class="common-image" alt="${
            appointment.AdminFirstName
          } ${appointment.AdminLastName} Image">
            </div>
            <div class="col-9">
              <h5 class="card-title">${appointment.AdminFirstName} ${
            appointment.AdminLastName
          }</h5>
              <p class="card-text bio">${appointment.AdminBio}</p>
            </div>
          </div>
          <div class="time-details mt-3 mb-3">
            <p class="start-time"><strong>Start:</strong> ${new Date(
              appointment.startDateTime
            ).toLocaleDateString("en-GB", {
              weekday: "long",
              month: "short",
              year: "numeric",
              day: "numeric",
            })} at ${new Date(appointment.startDateTime).toLocaleTimeString(
            "en-GB",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }
          )}</p>
            <p class="end-time"><strong>End:</strong> ${new Date(
              appointment.endDateTime
            ).toLocaleDateString("en-GB", {
              weekday: "long",
              month: "short",
              year: "numeric",
              day: "numeric",
            })} at ${new Date(appointment.endDateTime).toLocaleTimeString(
            "en-GB",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }
          )}</p>
          </div>
          <p class="card-text email"><strong>Email:</strong> ${
            appointment.AdminEmail
          }</p>
          <button class="btn btn-primary-custom mt-3" data-participant-url="${
            appointment.ParticipantURL
          }">Join Call</button>
        </div>
      </div>
    `;
          row.appendChild(appointmentCard);
        }

        // Append the row with appointment cards to the carousel item
        carouselItem.appendChild(row);
        coachingCarouselContainer.appendChild(carouselItem);
      }

      // Enable the carousel controls if there are more than three appointments
      if (appointments.length > 3) {
        document
          .querySelector(".carousel-control-prev")
          .classList.add("active");
        document
          .querySelector(".carousel-control-next")
          .classList.add("active");
      }
    } else {
      console.error("Failed to fetch appointments:", data.message);
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
}

// Call the functions to fetch and display events and appointments when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayEvents();
  fetchAppointments();
});
