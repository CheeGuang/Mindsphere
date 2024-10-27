// Function to fetch events from the API and update the HTML
async function fetchAndDisplayEvents() {
  const memberId = JSON.parse(localStorage.getItem("memberDetails"))?.memberID;

  if (!memberId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }

  try {
    const response = await fetch(
      `/api/event/get-event-by-member-id/${memberId}`
    ); // Adjust the URL if necessary
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const events = await response.json();

    // Get today's date
    const today = new Date();

    // Function to get the first date from availableDates
    const formatDateRange = (datesString) => {
      const datesArray = datesString.split(","); // Split by comma
      const firstDate = new Date(datesArray[0].trim());
      const lastDate = new Date(datesArray[datesArray.length - 1].trim());

      // Format the dates to '1 November 2024' format
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedFirstDate = firstDate.toLocaleDateString("en-GB", options);
      const formattedLastDate = lastDate.toLocaleDateString("en-GB", options);

      // If there are multiple dates, return the range, else return just the first date
      if (datesArray.length > 1) {
        return `${formattedFirstDate} - ${formattedLastDate}`;
      } else {
        return formattedFirstDate;
      }
    };

    // Filter upcoming events
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.availableDates.split(",")[0].trim()); // Get the first date for comparison
      return eventDate >= today; // Show only upcoming events
    });

    // Sort upcoming events by date in ascending order
    upcomingEvents.sort(
      (a, b) =>
        new Date(a.availableDates.split(",")[0].trim()) -
        new Date(b.availableDates.split(",")[0].trim())
    );

    // Update the event count
    const eventCountElement = document.getElementById("event-count");
    eventCountElement.textContent = `${upcomingEvents.length} events upcoming`;

    // Get the container for event cards
    const eventScrollContainer = document.getElementById(
      "event-scroll-container"
    );
    eventScrollContainer.innerHTML = ""; // Clear any existing content

    // Loop through the upcoming events and create HTML elements
    upcomingEvents.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.classList.add("common-card", "d-flex", "flex-row", "mx-3");

      // Use the event picture or a placeholder if not available
      const eventImageSrc = event.picture
        ? `${event.picture}`
        : "https://via.placeholder.com/150x150";

      // Build the inner HTML for the event card
      eventCard.innerHTML = `
    <div class="image-container">
      <img src="${eventImageSrc}" class="common-image" alt="${
        event.title
      } Image">
    </div>
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
    // You can display an error message on the UI if needed
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayEvents);
