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

  // Event function handler to enroll a member to an event using GET parameters
  static enrollMemberToEvent = async (req, res) => {
    // Use req.query instead of req.body for GET request parameters
    const {
      memberID,
      eventID,
      fullName,
      age,
      schoolName,
      interests,
      medicalConditions,
      lunchOption,
      specifyOther,
    } = req.query;

    try {
      const response = await Event.enrollMemberToEvent(
        memberID,
        eventID,
        fullName,
        age,
        schoolName,
        interests,
        medicalConditions,
        lunchOption,
        specifyOther
      );

      // If enrollment is successful, respond with success
      res.status(200).json(response);
    } catch (error) {
      console.error("Error enrolling member to event:", error);
      res.status(500).send("Error enrolling member to event");
    }
  };
}

// ========== Export ==========
module.exports = EventController;
