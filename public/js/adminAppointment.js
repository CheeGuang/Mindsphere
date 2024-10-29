document.addEventListener("DOMContentLoaded", async () => {
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  console.log("Loaded admin details from localStorage:", adminDetails);

  if (!adminDetails || !adminDetails.adminID) {
    console.error("No adminID found in localStorage.");
    return;
  }

  const adminID = adminDetails.adminID;
  console.log("Using adminID:", adminID);

  // Function to fetch appointments from the API endpoint
  async function fetchAppointments() {
    try {
      const response = await fetch(`/api/appointment/admin/${adminID}`);
      console.log("API request sent to fetch appointments");

      const data = await response.json();
      console.log("API response data:", data);

      if (response.ok) {
        console.log("Successfully fetched appointments data");
        // Sort and display appointments
        displayAppointments(data.appointments);
      } else {
        console.error("Failed to fetch appointments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  // Function to display sorted appointments
  function displayAppointments(appointments) {
    console.log("Displaying appointments:", appointments);
    if (!appointments || appointments.length === 0) {
      console.warn("No appointments found.");
      return;
    }

    const now = new Date();
    console.log("Current date and time:", now);

    // Separate and sort appointments
    const upcomingAppointments = appointments
      .filter((appt) => new Date(appt.startDateTime) >= now)
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    console.log("Upcoming appointments:", upcomingAppointments);

    const pastAppointments = appointments
      .filter((appt) => new Date(appt.startDateTime) < now)
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    console.log("Past appointments:", pastAppointments);

    const upcomingContainer = document.getElementById(
      "upcomingAppointmentsContainer"
    );
    const pastContainer = document.getElementById("pastAppointmentsContainer");

    // Display message if there are no upcoming appointments
    if (upcomingAppointments.length === 0) {
      const noUpcomingMessage = document.createElement("p");
      noUpcomingMessage.textContent = "No upcoming appointments";
      noUpcomingMessage.classList.add("no-appointments-message", "text-start");
      upcomingContainer.appendChild(noUpcomingMessage);
    } else {
      upcomingAppointments.forEach((appointment) => {
        const card = createAppointmentCard(
          appointment,
          "Join Call",
          "btn-primary-custom",
          true
        );
        upcomingContainer.appendChild(card);
        console.log("Added upcoming appointment card:", appointment);
      });
    }

    // Display message if there are no past appointments
    if (pastAppointments.length === 0) {
      const noPastMessage = document.createElement("p");
      noPastMessage.textContent = "No past appointments";
      noPastMessage.classList.add("no-appointments-message", "text-start");
      pastContainer.appendChild(noPastMessage);
    } else {
      pastAppointments.forEach((appointment) => {
        const card = createAppointmentCard(
          appointment,
          "View Notes",
          "btn-secondary-custom",
          false
        );
        pastContainer.appendChild(card);
        console.log("Added past appointment card:", appointment);
      });
    }
  }

  // Function to create an appointment card element
  function createAppointmentCard(
    appointment,
    buttonText,
    buttonClass,
    isUpcoming
  ) {
    console.log("Creating card for appointment:", appointment);

    const card = document.createElement("div");
    card.classList.add(
      isUpcoming ? "upcoming-card" : "past-card",
      "d-flex",
      "align-items-center",
      "shadow-sm",
      "my-3",
      "p-3"
    );
    card.style.paddingTop = "20px"; // Add padding to the top of the box

    const img = document.createElement("img");
    img.src = appointment.MemberProfilePicture || "./img/misc/account-icon.png";
    img.alt = "Member Image";
    img.classList.add("member-image", "me-3");
    img.style.border = "1.5px solid #c1c1c1"; // Add border to the picture

    const details = document.createElement("div");
    details.classList.add("member-details", "flex-grow-1", "text-start");
    details.style.marginRight = "15px"; // Add right margin to the text

    const name = document.createElement("h5");
    name.textContent = `${appointment.MemberFirstName} ${appointment.MemberLastName}`;
    name.style.marginBottom = "5px"; // Reduce spacing between text lines
    details.appendChild(name);

    const description = document.createElement("p");
    description.classList.add("member-request-description");
    description.textContent = appointment.requestDescription;
    description.style.marginBottom = "5px"; // Reduce spacing between text lines
    details.appendChild(description);

    const time = document.createElement("p");
    time.classList.add("appointment-time");
    time.textContent = formatDate(appointment.startDateTime);
    time.style.marginBottom = "5px"; // Reduce spacing between text lines
    details.appendChild(time);

    card.appendChild(img);
    card.appendChild(details);

    if (isUpcoming) {
      const button = document.createElement("button");
      button.classList.add("btn", buttonClass);
      button.textContent = buttonText;
      button.addEventListener("click", () => {
        console.log(
          "Join Call button clicked. Opening URL:",
          appointment.HostRoomURL
        );
        window.open(appointment.HostRoomURL, "_blank");
      });
      card.appendChild(button);
    }

    console.log("Created card:", card);
    return card;
  }

  // Helper function to format date and time
  function formatDate(dateTime) {
    const date = new Date(dateTime);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    console.log("Formatted date:", formattedDate);
    return formattedDate;
  }

  // Fetch and display appointments on page load
  fetchAppointments();
});
