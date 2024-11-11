$(document).ready(function () {
  let selectedExperience = null; // Variable to track the selected experience

  // Function to preload all events
  async function preloadEvents() {
    try {
      const response = await fetch("/api/event/get-all-event");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const events = await response.json();
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  // Helper function to format the available dates
  function formatDateRange(datesString) {
    const datesArray = datesString.split(",");
    const dateObjects = datesArray.map((date) => new Date(date.trim()));
    const options = { year: "numeric", month: "short", day: "numeric" };
    const dateFormatter = new Intl.DateTimeFormat("en-GB", options);
    const formattedDates = dateObjects.map((date) =>
      dateFormatter.format(date)
    );
    return formattedDates.length === 2
      ? `${formattedDates[0]} - ${formattedDates[1]}`
      : formattedDates[0];
  }

  // Function to render the selected workshop details
  function renderWorkshopDetails(eventData) {
    const formattedDateRange = formatDateRange(eventData.availableDates);
    const oldPriceHTML = eventData.oldPrice
      ? `<p class="old-price m-0"><del>$${eventData.oldPrice}</del></p>`
      : ""; // Only display old price if it's not null

    const content = `
          <div class="card shadow-sm mt-4" style="max-width: 600px; margin: auto; border-radius: 15px">
            <img src="${eventData.picture}" class="card-img-top" alt="${eventData.title}" style="border-top-left-radius: 15px; border-top-right-radius: 15px;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mt-2 mb-2">
                <h5 class="card-title fw-bold m-0">${eventData.title}</h5>
              </div>
              <div class="row">
                <div class="col-12 text-start info-section">
                  <p><span>Date:</span> ${formattedDateRange}</p>
                  <p><span>Time:</span> ${eventData.time}</p>
                  <p><span>Venue:</span> ${eventData.venue}</p>
                </div>
              </div>
            </div>
          </div>
        `;

    // Append content to the page
    $("#workshopContent").html(content);
  }

  // Load the selected event details based on query parameter
  async function loadSelectedWorkshop() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedEventID = urlParams.get("eventID");

    if (!selectedEventID) {
      console.error("No event ID in query parameters");
      return;
    }

    const events = await preloadEvents();
    const selectedEvent = events.find(
      (event) => event.eventID == selectedEventID
    );

    if (selectedEvent) {
      renderWorkshopDetails(selectedEvent);
    } else {
      console.error("Event not found");
    }
  }

  // Load the workshop details on page load
  loadSelectedWorkshop();

  // Add click event listener to feedback cards
  $(".feedback-card").on("click", function () {
    // Remove 'selected' class from all cards
    $(".feedback-card").removeClass("selected");

    // Add 'selected' class to the clicked card
    $(this).addClass("selected");

    // Update the selected experience value
    selectedExperience = $(this).find("input").val();
    console.log("Selected Experience:", selectedExperience);
  });

  // Feedback form validation and API submission
  $("#feedbackForm").on("submit", async function (event) {
    event.preventDefault();

    // Check if experience is selected
    if (!selectedExperience) {
      showCustomAlert("Please select your experience.");
      return;
    }

    // Check if pace slider has a value
    const pace = $("#paceSlider").val();
    if (!pace) {
      showCustomAlert("Please select the pace of the workshop.");
      return;
    }

    // Check if liked and disliked fields are filled
    const liked = $("#liked").val().trim();
    const disliked = $("#disliked").val().trim();

    if (!liked) {
      showCustomAlert("Please enter what you liked about the event.");
      return;
    }

    if (!disliked) {
      showCustomAlert("Please enter what could be improved.");
      return;
    }

    // Get the value of additional comments (optional)
    const additionalComments = $("#comments").val().trim();

    // Get memberEventID from session storage
    const memberEventID = sessionStorage.getItem("memberEventID");
    if (!memberEventID) {
      showCustomAlert("Missing member event ID.");
      return;
    }

    // Create JSON object for feedback
    const feedbackData = {
      memberEventID: parseInt(memberEventID), // Ensure memberEventID is a number
      experience: parseInt(selectedExperience),
      pace: parseInt(pace),
      liked: liked,
      disliked: disliked,
      additionalComments: additionalComments || null, // Include only if not empty
    };

    // Submit feedback to the API
    try {
      const response = await fetch("/api/event/add-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        showCustomAlert("Thank you for your feedback!");
        setTimeout(() => {
          window.location.href = "../memberMyEvent.html";
        }, 2000); // 2000 milliseconds = 2 seconds
      } else {
        const errorResponse = await response.json();
        console.error("Error submitting feedback:", errorResponse);
        showCustomAlert("Failed to submit feedback. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showCustomAlert("An error occurred while submitting feedback.");
    }
  });
});
