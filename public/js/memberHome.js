// Function to fetch events from the API and update the HTML
async function fetchAndDisplayEvents() {


  const memberId = JSON.parse(
    localStorage.getItem("memberID")
  );

  if (!memberId) {
    console.error("Error: Patient ID not found in local storage");
    return;
  }


  try {
    const response = await fetch(`/api/event/get-event-by-member-id/${memberId}`); // Adjust the URL if necessary
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const events = await response.json();
    
    // Get today's date
    const today = new Date();

    // Function to get the first date from availableDates
    const getFirstDate = (datesString) => {
      const datesArray = datesString.split(","); // Split by comma
      return new Date(datesArray[0].trim()); // Return the first date as Date object
    };

    // Filter upcoming events
    const upcomingEvents = events.filter(event => {
      const eventDate = getFirstDate(event.availableDates); // Get the first date for comparison
      return eventDate >= today; // Show only upcoming events
    });

    // Sort upcoming events by date in ascending order
    upcomingEvents.sort((a, b) => getFirstDate(a.availableDates) - getFirstDate(b.availableDates));

    // Update the event count
    const eventCountElement = document.getElementById('event-count');
    eventCountElement.textContent = `${upcomingEvents.length} events upcoming`;

    // Get the container for event cards
    const eventScrollContainer = document.getElementById('event-scroll-container');
    eventScrollContainer.innerHTML = ''; // Clear any existing content

    // Loop through the upcoming events and create HTML elements
    upcomingEvents.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.classList.add('card', 'd-flex', 'flex-row', 'mx-3');
      eventCard.style.minWidth = '600px';
      eventCard.style.alignItems = 'center';

      eventCard.innerHTML = `
        <img src="https://via.placeholder.com/150x150" class="event-image" alt="${event.title} Image">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text">
            Duration: ${event.duration}<br>
            ${event.availableDates}<br>
            ${event.time}<br>
            ${event.venue}
          </p>
        </div>
      `;

      // Append the event card to the container
      eventScrollContainer.appendChild(eventCard);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    // You can display an error message on the UI if needed
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayEvents);
