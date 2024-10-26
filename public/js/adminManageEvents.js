// Function to fetch and display events dynamically
const fetchAndDisplayEvents = async () => {
  try {
    const response = await fetch("/api/event/get-all-event");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const events = await response.json();

    // Sort events by availableDates in ascending order
    events.sort((a, b) => {
      const dateA = new Date(a.availableDates.split(",")[0].trim());
      const dateB = new Date(b.availableDates.split(",")[0].trim());
      return dateA - dateB;
    });

    const eventContainer = document.querySelector(".eventList");

    // Clear existing events (if any)
    eventContainer.innerHTML = '';

    // Loop through events and create cards
    events.forEach((event, index) => {
      const eventCard = document.createElement("div");
      eventCard.className = "card shadow mb-3";
      eventCard.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title">${event.title}</h5>
            <p class="mb-0">
              <i class="fas fa-users"></i> ${event.totalParticipants} participants &nbsp;&nbsp;
              <i class="fas fa-calendar-alt"></i> ${formatDateRange(event.availableDates)} &nbsp;&nbsp;
              <i class="fas fa-map-marker-alt"></i> ${event.venue}
            </p>
          </div>
          <div>
            <button id="edit-btn-eventid" class="btn btn-outline-secondary edit-event-btn" data-bs-toggle="modal" data-bs-target="#editEventModal" data-event-id="${event.eventID}" data-index="${index}">
              <i class="fas fa-edit"></i>
            </button>
            <button id="delete-btn-eventid" class="btn btn-outline-danger delete-event-btn" data-event-id="${event.eventID}" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      eventContainer.appendChild(eventCard);
    });

    // Attach event listeners to the edit buttons
    document.querySelectorAll('.edit-event-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const eventId = e.target.closest('button').getAttribute('data-event-id');
        console.log("Edit button clicked for event ID:", eventId); // Debugging
        const eventIndex = e.target.closest('button').getAttribute('data-index');
        populateModal(events[eventIndex]);
      });
    });

    // Attach event listeners to the delete buttons
    document.querySelectorAll('.delete-event-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const eventId = e.target.closest('button').getAttribute('data-event-id');
        console.log("Delete button clicked for event ID:", eventId); // Debugging
        await deleteEvent(eventId);
      });
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

// Helper function to delete an event by ID
const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`/api/event/delete-event/${eventId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Failed to delete the event");
    }

    console.log("Event deleted successfully, ID:", eventId); // Debugging
    // Fetch and display updated events after deletion
    fetchAndDisplayEvents();
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

// Helper function to format availableDates
const formatDateRange = (datesString) => {
  const datesArray = datesString.split(",");
  return datesArray.join(" - ");
};

// Function to populate the modal with event data
const populateModal = (event) => {
  document.getElementById('eventTitle').value = event.title;
  document.getElementById('eventPrice').value = `$${event.price}`;

  // Set event start and end dates in separate fields
  const datesArray = event.availableDates.split(",").map(date => date.trim());
  document.getElementById('eventDateStart').value = datesArray[0] || "Start Date not available";
  document.getElementById('eventDateEnd').value = datesArray[1] || "End Date not available";
  
  document.getElementById('eventVenue').value = event.venue;
  document.getElementById('eventDuration').value = event.duration;

  const eventImage = document.getElementById('eventImage');
  eventImage.src = event.picture || 'img/workshop/professionals.jpg';
  eventImage.alt = event.title || 'Event Image';

  console.log("Populating modal for event ID:", event.eventID); // Debugging
  document.getElementById('edit-btn-eventid').setAttribute('data-event-id', event.eventID);
};

// Enable editing for the specified input field
function enableEditing(inputId) {
  const inputField = document.getElementById(inputId);
  inputField.disabled = !inputField.disabled;
  if (!inputField.disabled) {
    inputField.focus();
  }
}

// Function to save changes
const saveChanges = async () => {
  const eventId = document.getElementById('edit-btn-eventid').getAttribute('data-event-id');
  console.log("Saving changes for event ID:", eventId); // Debugging
  const updatedEvent = {
    title: document.getElementById('eventTitle').value,
    price: document.getElementById('eventPrice').value.replace('$', ''),
    availableDates: `${document.getElementById('eventDateStart').value}, ${document.getElementById('eventDateEnd').value}`,
    venue: document.getElementById('eventVenue').value,
    duration: document.getElementById('eventDuration').value,
  };

  try {
    const response = await fetch(`/api/event/update-event/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      throw new Error("Failed to update the event");
    }

    console.log("Event updated successfully, ID:", eventId); // Debugging
    fetchAndDisplayEvents();
    $('#editEventModal').modal('hide');
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

// Initial call to fetch and display events when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayEvents);
