$(document).ready(function () {
  // Preload events (we assume this function works)
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

  // Function to render a card in the modal
  function renderEventInModal(eventData, index) {
    const isBlueBackground =
      index % 2 === 0 ? "bg-beginner" : "bg-intermediate"; // Toggle between blue and white backgrounds
    const buttonClass =
      index % 2 === 0 ? "lightgetstarted-btn" : "getstarted-btn"; // Set button class based on background

    return `
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm ${isBlueBackground}">
              <div class="card-body d-flex flex-column text-start">
                <h3 class="card-title">$${eventData.price}*</h3>
                <p class="text-muted fw-bold"><s>Was $${
                  eventData.oldPrice
                }</s></p>
                <h5>${eventData.title}</h5>
                <p>${eventData.description || "Description not available."}</p>
                <div class="d-flex justify-content-center mt-auto">
                  <a href="javascript:void(0);" class="${buttonClass} mt-3 mb-4" onclick="handleGetStartedClick('${eventData.eventID}')">Get started</a>
                </div>
                <ul class="list-unstyled">
                  <li><i class="fas fa-check-circle me-2"></i>Class size: ${
                    eventData.classSize
                  }</li>
                  <li><i class="fas fa-check-circle me-2"></i>Duration: ${
                    eventData.duration
                  }</li>
                  <li><i class="fas fa-check-circle me-2"></i>${
                    eventData.lunchProvided
                      ? "Lunch provided"
                      : "Lunch not provided"
                  }</li>
                  <li><i class="fas fa-check-circle me-2"></i>${
                    eventData.lessonMaterialsProvided
                      ? "Lesson materials provided"
                      : "Lesson materials not provided"
                  }</li>
                  <li><i class="fas fa-check-circle me-2"></i>Complimentary 1 year membership with access to our resources and member rates for all programmes</li>
                </ul>
              </div>
            </div>
          </div>
        `;
  }

  // Store the selected event ID in localStorage and redirect to the workshop details page
  window.handleGetStartedClick = function (eventID) {
    localStorage.setItem("selectedEventID", eventID);
    window.location.href = "./guestWorkshopInformation.html";
  };

  // Event listener for modals (sample for Public Speaking Workshops)
  $("#publicSpeakingCard").click(function () {
    openModalForEventType(
      "Public Speaking Workshops",
      "#publicSpeakingModal",
      "#publicSpeakingWorkshopContent"
    );
  });

  // Event listener for PSLE Power Up Camp modal
  $("#pslePowerUpCampCard").click(function () {
    openModalForEventType(
      "PSLE Power Up Camp",
      "#pslePowerUpCampModal",
      "#pslePowerUpCampContent"
    );
  });

  // Function to open the modal for a specific event type and inject content
  async function openModalForEventType(eventType, modalSelector, containerId) {
    const events = await preloadEvents();
    const filteredEvents = events.filter((event) => event.type === eventType);

    // Clear existing content in the modal
    const modalContainer = $(containerId);
    modalContainer.empty();

    // Inject content into the modal
    filteredEvents.forEach((event, index) => {
      const eventHTML = renderEventInModal(event, index);
      modalContainer.append(eventHTML);
    });

    // Show the modal
    $(modalSelector).modal("show");
  }
});
