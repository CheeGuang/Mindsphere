// ========== Models ==========
const Event = require("../../models/event");

// ========== Controller ==========
class EventController {
  // Event function handler to get all events
  static getAllEvent = async (req, res) => {
    try {
      const events = await Event.getAllEvent();
      res.json(events);
    } catch (error) {
      console.error("Error retrieving events:", error.message);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get events by ID
  static getEventById = async (req, res) => {
    const eventID = req.params.eventId; // Use console.log here to debug
    console.log("Received eventID:", eventID);

    try {
      const events = await Event.getEventById(eventID);
      if (events.length > 0) {
        res.json(events);
      } else {
        res.status(404).json({ message: "No events found" });
      }
    } catch (error) {
      console.error("Error retrieving events by ID:", error);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get events by member ID
  static getEventByMemberId = async (req, res) => {
    const memberID = req.params.memberId; // Use console.log here to debug
    console.log("Received memberID:", memberID);

    try {
      const events = await Event.getEventByMemberId(memberID);
      if (events.length > 0) {
        res.json(events);
      } else {
        res.status(404).json({ message: "No events found for this member" });
      }
    } catch (error) {
      console.error("Error retrieving events by member ID:", error);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get unique event types with pictures
  static getUniqueEventTypes = async (req, res) => {
    try {
      const uniqueEventTypes = await Event.getUniqueEventTypes(); // Fetch event types and pictures
      res.json(uniqueEventTypes);
    } catch (error) {
      console.error("Error retrieving unique event types:", error.message);
      res.status(500).send("Error retrieving unique event types");
    }
  };

  static updateEvent = async (req, res) => {
    const eventId = req.params.eventId; // Get the eventID from the request parameters
    const updatedData = req.body; // Get the updated data from the request body

    try {
        // Call the update function in the Event model
        const result = await Event.updateEvent(eventId, updatedData);
        res.status(200).send("Event updated successfully");
    } catch (error) {
        console.error("Error updating event:", error.message); // Log the error message
        res.status(500).send("Failed to save changes"); // Send a user-friendly error message
    }
};

// Event function handler to delete an event by ID
static deleteEventById = async (req, res) => {
  const eventID = req.params.eventId;

  try {
    await Event.deleteEventById(eventID);
    res.status(200).json({ message: `Event with ID ${eventID} has been deleted successfully.` });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).send(`Failed to delete event with ID ${eventID}.`);
  }
};


}

// ========== Export ==========
module.exports = EventController;
