$(document).ready(function () {
  // Function to preload all events
  async function preloadEvents() {
    try {
      const response = await fetch("/api/event/get-all-event");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const events = await response.json();
      console.log("Events Loaded:", events); // Debugging line
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
          <img src="${eventData.picture}" class="card-img-top" alt="${
      eventData.title
    }" style="border-top-left-radius: 15px; border-top-right-radius: 15px;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mt-2 mb-2">
              <h5 class="card-title fw-bold m-0">${eventData.title}</h5>
              <div class="text-end" style="line-height: 1">
                <h5 class="price-section fw-bold m-0">$${eventData.price}</h5>
                ${oldPriceHTML}
              </div>
            </div>
            <p class="workshop-info-title text-start">Workshop Details</p>
            <div class="row">
              <div class="col-6 text-start info-section">
                <p><span>Class Size:</span> ${
                  eventData.classSize
                } participants</p>
                <p><span>Duration:</span> ${eventData.duration}</p>
                <p><span>Lunch:</span> ${
                  eventData.lunchProvided
                    ? "Lunch Provided"
                    : "Lunch Not Provided"
                }</p>
                <p><span>Materials:</span> ${
                  eventData.lessonMaterialsProvided
                    ? "Lesson Materials Provided"
                    : "Lesson Materials Not Provided"
                }</p>
              </div>
              <div class="col-6 text-start info-section">
                <p><span>Date:</span> ${formattedDateRange}</p>
                <p><span>Time:</span> ${eventData.time}</p>
                <p><span>Participants:</span> ${
                  eventData.totalParticipants
                } Total</p>
                <p><span>Membership:</span> 1 Year Membership Included</p>
              </div>
            </div>
            <p class="mt-2 text-start"><span>Venue:</span> ${
              eventData.venue
            }</p>
            <div class="text-center mt-4">
              <a href="javascript:void(0);" class="btn btn-primary text-white btn-register">Register</a>
            </div>
          </div>
        </div>
      `;

    // Append content to the page
    $("#workshopContent").html(content);

    $(".btn-register").on("click", function () {
      const memberID = JSON.parse(
        localStorage.getItem("memberDetails")
      )?.memberID;
      const eventDetails = {
        eventID: eventData.eventID,
        title: eventData.title,
        price: eventData.price,
      };
      sessionStorage.setItem(
        "selectedEventDetails",
        JSON.stringify(eventDetails)
      );

      if (memberID) {
        window.location.href = "../memberParticipantsInformation.html";
      } else {
        window.location.href = "../memberLogin.html";
      }
    });
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
      console.log("Selected Event Found:", selectedEvent); // Debugging line
      renderWorkshopDetails(selectedEvent);
    } else {
      console.error("Event not found");
    }
  }

  // Load the workshop details on page load
  loadSelectedWorkshop();
});
