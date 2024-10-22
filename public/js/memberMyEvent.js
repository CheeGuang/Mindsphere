const fetchAndDisplayEvents = async () => {
  try {
    const memberId = JSON.parse(localStorage.getItem("memberID")); // Get member ID from local storage

    if (!memberId) {
      console.error("Error: Member ID not found in local storage");
      return;
    }

    const response = await fetch(`http://localhost:8000/api/event/get-event-by-member-id/${memberId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const events = await response.json();

    // Log all events to check the availableDates format
    console.log("All Events:", events);

    const today = new Date();

    // Function to get the first date from availableDates
    const getFirstDate = (datesString) => {
      const datesArray = datesString.split(","); // Split by comma
      return new Date(datesArray[0].trim()); // Return the first date as Date object
    };

    // Separate upcoming and past events
    const upcomingEvents = events.filter(event => {
      const eventDate = getFirstDate(event.availableDates); // Get the first date for comparison
      return eventDate >= today;
    });

    const pastEvents = events.filter(event => {
      const eventDate = getFirstDate(event.availableDates); // Get the first date for comparison
      return eventDate < today;
    });

    // Sort the events by date in ascending order
    upcomingEvents.sort((a, b) => getFirstDate(a.availableDates) - getFirstDate(b.availableDates));
    pastEvents.sort((a, b) => getFirstDate(a.availableDates) - getFirstDate(b.availableDates));

    // Debugging: Log the upcoming and past events
    console.log("Upcoming Events:", upcomingEvents);
    console.log("Past Events:", pastEvents);

    // Function to create and append event cards (same as before)
    const createEventCard = (event, isUpcoming) => {
      const eventSection = isUpcoming ? document.getElementById("upcoming-events") : document.getElementById("past-events");
      const card = document.createElement("div");
      card.className = "card mb-4";
      card.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="https://via.placeholder.com/150" class="img-fluid rounded-start" alt="${event.title}" />
          </div>
          <div class="col-md-8">
            <div class="card-body text-start">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text">Duration: ${event.duration}</p>
              <p class="card-text">${event.availableDates}</p>
              <p class="card-text">${event.time}</p>
              <p class="card-text">${event.venue}</p>
              <button class="btn btn-dark">View Invoice</button>
            </div>
          </div>
        </div>
      `;
      eventSection.appendChild(card);
    };

    // Display upcoming events
    upcomingEvents.forEach(event => createEventCard(event, true));

    // Display past events
    pastEvents.forEach(event => createEventCard(event, false));

  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

// Call the function to fetch and display events
fetchAndDisplayEvents();
