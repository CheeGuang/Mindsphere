// ========== Models ==========
const Event = require("../../models/event");

// ========== Controller ==========
class EventController {
  // Event function handler
  static getAllEvent = async (req, res) => {
    try {
      const event = await Event.getAllEvent();
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving event");
    }
  };
}

// ========== Export ==========
module.exports = EventController;
