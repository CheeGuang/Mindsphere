const fetchAndDisplayEvents = async () => {
  try {
    const memberId = JSON.parse(
      localStorage.getItem("memberDetails")
    )?.memberID; // Get member ID from local storage

    if (!memberId) {
      console.error("Error: Member ID not found in local storage");
      return;
    }

    const response = await fetch(
      `${window.location.origin}/api/event/get-event-by-member-id/${memberId}`
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
        <div class="row g-0 p-2">
          <div class="col-md-4">
            <img src="${eventImageSrc}" class="img-fluid event-image rounded-start" alt="${
        event.title
      }" />
          </div>
          <div class="col-md-8">
            <div class="card-body d-flex flex-column justify-content-between text-start">
              <div>
                <h5 class="card-title mb-3">${event.title}</h5>
                <p class="card-text">Name: ${event.fullName}</p>
                <p class="card-text">Duration: ${event.duration}</p>
                <p class="card-text">${formatDateRange(
                  event.availableDates
                )}</p>
                <p class="card-text">${event.time}</p>
                <p class="card-text">${event.venue}</p>
              </div>
              <div class="mt-3 d-flex gap-2">
                <button class="btn btn-dark btn-view-invoice" data-event-id="${
                  event.eventID
                }">View Invoice</button>
                ${
                  isUpcoming
                    ? ""
                    : event.experience
                    ? `<button class="btn btn-success" disabled>Feedback Complete</button>`
                    : `<button class="btn btn-primary btn-feedback" data-member-event-id="${event.memberEventID}">Give Feedback</button>`
                }
              </div>
            </div>
          </div>
        </div>
      `;

      // Append card to the appropriate section
      eventSection.appendChild(card);

      // Attach an event listener to the "View Invoice" button
      const viewInvoiceButton = card.querySelector(".btn-view-invoice");
      viewInvoiceButton.addEventListener("click", async () => {
        try {
          const payload = {
            eventDetails: {
              title: event.title,
              price: event.price,
            },
            participantsData: [
              [JSON.parse(localStorage.getItem("memberDetails"))],
            ],
            memberDetails: JSON.parse(localStorage.getItem("memberDetails")),
            memberEventID: event.memberEventID,
          };

          const response = await fetch(
            `${window.localStorage.origin}/api/event/view-invoice`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch invoice.");
          }

          const { url } = await response.json();

          // Open the invoice in a new window
          window.open(url, "_blank");
        } catch (error) {
          console.error("Error viewing invoice:", error);
        }
      });

      // Attach an event listener to the "Give Feedback" button if it exists
      if (!isUpcoming && !event.experience) {
        const feedbackButton = card.querySelector(".btn-feedback");
        feedbackButton.addEventListener("click", () => {
          // Store memberEventID in session storage
          const memberEventID = feedbackButton.getAttribute(
            "data-member-event-id"
          );
          sessionStorage.setItem("memberEventID", memberEventID);

          // Redirect to the feedback page with event.eventID in the query parameter
          const eventID = event.eventID;
          window.location.href = `../memberEventFeedback.html?eventID=${eventID}`;
        });
      }
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
