// Utility function to format the event date range
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

// Function to fetch events from the API and update the HTML for the admin home page
async function fetchAndDisplayEvents() {
  try {
    const response = await fetch("/api/event/get-all-event");
    if (!response.ok) throw new Error("Network response was not ok");
    const events = await response.json();

    // Get today's date and filter upcoming events
    const today = new Date();
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.availableDates.split(",")[0].trim());
      return eventDate >= today;
    });

    // Sort upcoming events by date in ascending order (most recent first)
    upcomingEvents.sort(
      (a, b) =>
        new Date(a.availableDates.split(",")[0].trim()) -
        new Date(b.availableDates.split(",")[0].trim())
    );

    // Update the event count
    document.getElementById(
      "event-count"
    ).textContent = `${upcomingEvents.length} events upcoming`;

    // Get the container for event items
    const eventContainer = document.getElementById("event-container");
    eventContainer.innerHTML = ""; // Clear existing content

    // Display all upcoming events
    upcomingEvents.forEach((event) => {
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
                  <p class="card-text"><strong>Address:</strong> ${
                    event.venue
                  }</p>
                </div>
              </div>`;
      eventContainer.appendChild(eventCard);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Function to fetch appointments from the API and update HTML for the admin home page
async function fetchAppointments() {
  const adminId = JSON.parse(localStorage.getItem("adminDetails"))?.adminID;

  if (!adminId) {
    console.error("Error: Admin ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(`/api/appointment/admin/${adminId}`);
    const data = await response.json();

    if (response.ok) {
      const appointments = data.appointments;

      // Sort appointments by start date in ascending order (most recent first)
      appointments.sort(
        (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
      );

      // Update the appointment count
      document.getElementById(
        "appointment-count"
      ).textContent = `${appointments.length} appointments upcoming`;

      const appointmentContainer = document.getElementById(
        "appointment-container"
      );
      appointmentContainer.innerHTML = ""; // Clear existing content

      // Display all appointments
      appointments.forEach((appointment) => {
        console.log(appointment);
        const profilePicture =
          appointment.MemberProfilePicture ||
          "https://via.placeholder.com/150x150";
        const appointmentCard = document.createElement("div");
        appointmentCard.classList.add("col-md-4");
        appointmentCard.innerHTML = `
                <div class="card carousel-card mx-auto mb-4">
                  <div class="card-body text-start">
                    <div class="row align-items-center">
                      <div class="col-3 text-start">
                        <img src="${profilePicture}" class="common-image" alt="${
          appointment.FirstName
        } ${appointment.LastName} Image">
                      </div>
                      <div class="col-9">
                        <h5 class="card-title">${appointment.MemberFirstName} ${
          appointment.MemberLastName
        }</h5>
                        
                      </div>
                    </div>
                    <div class="time-details mt-3 mb-3">
                      <p class="start-time"><strong>Start:</strong> ${new Date(
                        appointment.startDateTime
                      ).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "short",
                        year: "numeric",
                        day: "numeric",
                      })} at ${new Date(
          appointment.startDateTime
        ).toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}</p>
                      <p class="end-time"><strong>End:</strong> ${new Date(
                        appointment.endDateTime
                      ).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "short",
                        year: "numeric",
                        day: "numeric",
                      })} at ${new Date(
          appointment.endDateTime
        ).toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}</p>
                    </div>
                    <p class="card-text email"><strong>Email:</strong> ${
                      appointment.MemberEmail
                    }</p>
                    <button class="btn btn-primary-custom mt-3" data-participant-url="${
                      appointment.ParticipantURL
                    }">Join Call</button>
                  </div>
                </div>`;
        appointmentContainer.appendChild(appointmentCard);
      });
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
