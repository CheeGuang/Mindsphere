const fetchAndDisplayEvents = async () => {
  try {
    const memberId = JSON.parse(localStorage.getItem("memberID")); // Get member ID from local storage

    if (!memberId) {
      console.error("Error: Member ID not found in local storage");
      return;
    }

    const response = await fetch(
      `http://localhost:8000/api/event/get-event-by-member-id/${memberId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const events = await response.json();

    const today = new Date();

    // Function to format the availableDates
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

    // Separate upcoming and past events
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.availableDates.split(",")[0].trim()); // Get the first date for comparison
      return eventDate >= today;
    });

    const pastEvents = events.filter((event) => {
      const eventDate = new Date(event.availableDates.split(",")[0].trim()); // Get the first date for comparison
      return eventDate < today;
    });

    // Sort the events by date in ascending order
    upcomingEvents.sort(
      (a, b) =>
        new Date(a.availableDates.split(",")[0].trim()) -
        new Date(b.availableDates.split(",")[0].trim())
    );
    pastEvents.sort(
      (a, b) =>
        new Date(a.availableDates.split(",")[0].trim()) -
        new Date(b.availableDates.split(",")[0].trim())
    );

    // Function to create and append event cards with the image from the database
    const createEventCard = (event, isUpcoming) => {
      const eventSection = isUpcoming
        ? document.getElementById("upcoming-events")
        : document.getElementById("past-events");
      const card = document.createElement("div");
      card.className = "card mb-4";

      // Use the event picture or a placeholder if not available
      const eventImageSrc = event.picture
        ? `${event.picture}` // Adjust the path to where the images are stored
        : "https://via.placeholder.com/150"; // Fallback placeholder image

      card.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${eventImageSrc}" class="img-fluid event-image rounded-start" alt="${
        event.title
      }" />
          </div>
          <div class="col-md-8">
            <div class="card-body text-start">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text">Duration: ${event.duration}</p>
              <p class="card-text">${formatDateRange(event.availableDates)}</p>
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
    upcomingEvents.forEach((event) => createEventCard(event, true));

    // Display past events
    pastEvents.forEach((event) => createEventCard(event, false));
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

// Call the function to fetch and display events
fetchAndDisplayEvents();
