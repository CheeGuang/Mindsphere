// Utility function to format the available date range
const formatDateRange = (availableDates) => {
    const datesArray = availableDates.split(",");
    if (datesArray.length === 1) {
      return `Date: ${datesArray[0].trim()}`;
    }
    return `From: ${datesArray[0].trim()} to ${datesArray[datesArray.length - 1].trim()}`;
  };
  
  // Utility function to get the first date from the availableDates string
  const getFirstDate = (availableDates) => {
    const datesArray = availableDates.split(","); // Split by commas
    return new Date(datesArray[0].trim()); // Return the first date as a Date object
  };
  
  // Function to fetch and display events from the API
  const fetchAndDisplayEvents = async () => {
    try {
      const response = await fetch("/api/event/get-all-event"); // Call the get-all-event API
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const events = await response.json();
      console.log("All Events:", events); // Log all events to check the data
  
      // Sort events by the first available date in ascending order
      const sortedEvents = events.sort((a, b) => getFirstDate(a.availableDates) - getFirstDate(b.availableDates));
  
      // Get the container for event cards
      const eventScrollContainer = document.getElementById("event-scroll-container");
      eventScrollContainer.innerHTML = ""; // Clear any existing content
  
      // Loop through the sorted events and create HTML elements for each event
      sortedEvents.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("card", "d-flex", "flex-row", "mx-3");
        eventCard.style.minWidth = "600px";
        eventCard.style.alignItems = "center";
  
        // Set event image or placeholder if no image is available
        const eventImageSrc = event.picture
          ? `${event.picture}`
          : "https://via.placeholder.com/150x150";
  
        // Build the inner HTML for the event card
        eventCard.innerHTML = `
          <img src="${eventImageSrc}" class="event-image" alt="${event.title} Image" style="width: 150px; height: 150px;">
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">
              Duration: ${event.duration}<br>
              ${formatDateRange(event.availableDates)}<br>
              ${event.time}<br>
              ${event.venue}
            </p>
          </div>
        `;
  
        // Append the event card to the container
        eventScrollContainer.appendChild(eventCard);
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  // Call the function when the page loads
  document.addEventListener("DOMContentLoaded", fetchAndDisplayEvents);
  