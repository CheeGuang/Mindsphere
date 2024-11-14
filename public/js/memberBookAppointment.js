document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("hasSentRequest")) {
    localStorage.removeItem("hasSentRequest");
  }

  let selectedCoach = null;
  let coachesData = [];
  const memberID = JSON.parse(localStorage.getItem("memberDetails")).memberID; // Replace with the actual member ID value

  // Function to fetch all coaches' data from the server
  function fetchCoachesData() {
    fetch("/api/admin/get-all-admins")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          coachesData = data.data; // Store fetched data for later use
          displayCoaches(coachesData);

          // Automatically select the first coach and display their Calendly link
          if (coachesData.length > 0) {
            selectCoach(
              coachesData[0].firstName.toLowerCase(),
              coachesData[0].adminID,
              coachesData[0].calendlyAccessToken
            );
          }
        } else {
          console.error("Failed to fetch coaches data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching coaches data:", error);
      });
  }

  // Function to dynamically display the coaches
  function displayCoaches(coaches) {
    const coachesSection = $("#coaches-section");
    let rowContent = "";

    coaches.forEach((coach, index) => {
      if (index % 4 === 0) {
        if (index !== 0) {
          rowContent += `</div>`;
        }
        rowContent += `<div class="row justify-content-center mb-4">`;
      }

      rowContent += `
        <div class="col-md-5 mb-3">
          <div class="card coach-card d-flex align-items-center p-3 ${
            index === 0 ? "selected" : ""
          }" data-coach="${coach.firstName.toLowerCase()}" data-adminId="${
        coach.adminID
      }" data-calendlyAccessToken="${coach.calendlyAccessToken}">
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

      if (index === coaches.length - 1) {
        rowContent += `</div>`;
      }
    });

    coachesSection.html(rowContent);

    // Add click event listener for selecting a coach
    $(".coach-card").on("click", function () {
      const adminID = $(this).data("adminid");
      const calendlyAccessToken = $(this).data("calendlyaccesstoken");
      selectCoach($(this).data("coach"), adminID, calendlyAccessToken);
    });
  }

  // Function to select a coach and display their Calendly link
  function selectCoach(coachName, adminID, calendlyAccessToken) {
    // Remove 'selected' class from all other cards
    $(".coach-card").removeClass("selected");

    // Add 'selected' class to the clicked card
    $(`.coach-card[data-coach="${coachName}"]`).addClass("selected");

    // Set the selected coach
    selectedCoach = coachName;

    // Find the selected coach in the fetched data
    const coachData = coachesData.find(
      (coach) => coach.firstName.toLowerCase() === selectedCoach
    );

    // If the coach has a Calendly link, embed it in the calendar container
    if (coachData && coachData.calendlyLink) {
      document.getElementById("custom-calendar").innerHTML = ""; // Clear existing content

      // Initialize the Calendly widget with the selected coach's link
      initCalendlyWidget(coachData.calendlyLink, adminID, calendlyAccessToken);
    } else {
      console.log("Calendly link not available for the selected coach.");
    }
  }

  // Function to initialize the Calendly widget and wait for iframe load
  function initCalendlyWidget(url, adminID, calendlyAccessToken) {
    // Flag to ensure the fetch request is sent only once
    const hasSentRequestKey = "hasSentRequest";

    // Initialize the Calendly widget
    Calendly.initInlineWidget({
      url: url,
      parentElement: document.getElementById("custom-calendar"),
      prefill: {},
      utm: {},
    });

    // Listen for messages from Calendly to capture scheduled events
    window.addEventListener(
      "message",
      async function handleCalendlyEvent(event) {
        // Check if the message is from Calendly
        if (
          event.origin === "https://calendly.com" &&
          event.data.event === "calendly.event_scheduled"
        ) {
          console.log("Calendly event scheduled:", event.data.payload);

          // Get the full event URI from Calendly payload
          const eventURI = event.data.payload.event.uri;

          // Check if the request has already been sent
          if (localStorage.getItem(hasSentRequestKey)) {
            console.warn("Appointment creation request already sent.");
            return;
          }

          try {
            // Mark the request as sent by storing in localStorage
            localStorage.setItem(hasSentRequestKey, "true");

            // Send the eventURI, memberID, adminID, and calendlyAccessToken to the backend endpoint to create the appointment
            const response = await fetch(
              `${window.location.origin}/api/appointment/create-appointment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  eventURI: eventURI,
                  memberID: memberID,
                  adminID: adminID,
                  calendlyAccessToken: calendlyAccessToken,
                }),
              }
            );

            const result = await response.json();
            if (response.ok) {
              console.log("Appointment created successfully:", result);
              // Display success message using showCustomAlert
              showCustomAlert("Appointment scheduled successfully!");
            } else {
              console.error("Failed to create appointment:", result.message);
            }

            // Remove the event listener after the fetch is completed
            window.removeEventListener("message", handleCalendlyEvent);
          } catch (error) {
            console.error("Error while creating appointment:", error.message);
          }
        }
      }
    );
  }

  // Fetch and display the coaches when the page is ready
  fetchCoachesData();
});
