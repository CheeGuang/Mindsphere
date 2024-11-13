document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".calendar h3");
  const dates = document.querySelector(".dates");
  const navs = document.querySelectorAll("#prev, #next");
  const eventsDisplayContainer = document.getElementById("events-display");
  const eventDetailsContainer = document.getElementById("event-details-container");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();
  let allEventDates = []; // Store dates with events here

  function renderCalendar() {
    const start = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    const end = new Date(year, month, endDate).getDay();
    const endDatePrev = new Date(year, month, 0).getDate();

    let datesHtml = "";

    // Render previous month's days
    for (let i = start; i > 0; i--) {
      datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    // Render current month's days
    for (let i = 1; i <= endDate; i++) {
      const fullDate = `${year}-${month + 1}-${i}`;
      const isToday = i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      const isEventDate = allEventDates.includes(fullDate);

      datesHtml += `<li data-date="${fullDate}" class="${isToday ? "today" : ""} ${isEventDate ? "event-date" : ""}">${i}</li>`;
    }

    // Render next month's days
    for (let i = end; i < 6; i++) {
      datesHtml += `<li class="inactive">${i - end + 1}</li>`;
    }

    dates.innerHTML = datesHtml;
    header.textContent = `${months[month]} ${year}`;

    // Add click event to each date
    const dateItems = document.querySelectorAll(".dates li:not(.inactive)");
    dateItems.forEach(item => {
      item.addEventListener("click", (e) => {
        const selectedDate = e.target.getAttribute("data-date");
        // Remove 'selected' class from any currently selected date
        dateItems.forEach(d => d.classList.remove('selected'));
        // Add 'selected' class to the clicked date
        item.classList.add('selected');
        // Fetch events for the selected date
        fetchEvents(selectedDate);
      });
    });
  }

  function displayEvents(events) {
    // Clear previous events displayed
    eventsDisplayContainer.innerHTML = "";
    eventDetailsContainer.innerHTML = "";

    events.forEach(event => {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event-item");

      // Create content for event title and type
      eventDiv.innerHTML = `
        <h5>${event.title}</h5>
        <p>Type: ${event.type}</p>
        <p class="card-text"><strong>Time:</strong> ${event.time}</p>
      `;

      // Add click event listener to each event item
      eventDiv.addEventListener("click", () => {
        // Prevent multiple inserts of the same event details
        if (!document.getElementById(`details-${event.id}`)) {
          const eventDetailsDiv = document.createElement("div");
          eventDetailsDiv.id = `details-${event.id}`;
          eventDetailsDiv.classList.add("card", "mb-4", "event-details");

          const eventImageSrc = event.picture || "https://via.placeholder.com/150";

          eventDetailsDiv.innerHTML = `
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${eventImageSrc}" class="img-fluid event-image rounded-start" alt="${event.title}" />
              </div>
              <div class="col-md-8">
                <div class="card-body d-flex flex-column justify-content-between text-start">
                  <h2 class="card-title">${event.title}</h2>
                  <p class="card-text"><strong>Type:</strong> ${event.type}</p>
                  <p class="card-text"><strong>Price:</strong> $${event.price} <del>$${event.oldPrice}</del></p>
                  <p class="card-text"><strong>Duration:</strong> ${event.duration}</p>
                  <p class="card-text"><strong>Lunch Provided:</strong> ${event.lunchProvided ? "Yes" : "No"}</p>
                  <p class="card-text"><strong>Lesson Materials Provided:</strong> ${event.lessonMaterialsProvided ? "Yes" : "No"}</p>
                  <p class="card-text"><strong>Available Dates:</strong> ${event.availableDates}</p>
                  <p class="card-text"><strong>Time:</strong> ${event.time}</p>
                  <p class="card-text"><strong>Venue:</strong> ${event.venue}</p>
                  <p class="card-text"><strong>Total Participants:</strong> ${event.totalParticipants} / ${event.classSize}</p>
                  <button class="btn btn-secondary btn-close-event">Close</button>
                </div>
              </div>
            </div>
          `;

          const closeButton = eventDetailsDiv.querySelector(".btn-close-event");
          closeButton.addEventListener("click", () => {
            eventDetailsDiv.remove();
          });

          eventDetailsContainer.appendChild(eventDetailsDiv);
        }
      });

      // Append the created div to the events display container
      eventsDisplayContainer.appendChild(eventDiv);
    });
  }

  function fetchEvents(date) {
    fetch(`/api/event/getevent/by-available-dates?availableDates=${date}`)
      .then(response => response.json())
      .then(data => {
        displayEvents(data); // Display events based on the fetched data
      })
      .catch(error => console.error("Error fetching events:", error));
  }

  function getAllEvent() {
    fetch(`/api/event/get-all-event`)
      .then(response => response.json())
      .then(data => {
        allEventDates = data.flatMap(datesStr => datesStr.availableDates.split(",")); // Flatten date strings into array
        renderCalendar(); // Render calendar after fetching events
        displayTodayEvents(); // Display events for today's date
      })
      .catch(error => console.error("Error fetching events:", error));
  }

  function displayTodayEvents() {
    const todayDate = `${year}-${month + 1}-${date.getDate()}`;
    const todayItem = document.querySelector(`.dates li[data-date="${todayDate}"]`);
    if (todayItem) {
      todayItem.classList.add("selected");
      fetchEvents(todayDate); // Fetch and display events for today
    }
  }

  navs.forEach((nav) => {
    nav.addEventListener("click", (e) => {
      const btnId = e.target.id;

      if (btnId === "prev" && month === 0) {
        year--;
        month = 11;
      } else if (btnId === "next" && month === 11) {
        year++;
        month = 0;
      } else {
        month = btnId === "next" ? month + 1 : month - 1;
      }

      renderCalendar();
    });
  });

  // Initial load
  getAllEvent();
});
