import Event from "../models/event.model.js";
import { io } from "../server.js";

export const createEvent = async (req, res) => {
  try {
    const eventBody = req.body;
    const event = new Event({
      ...eventBody,
      creator: req.user._id,
      attendees: [req.user._id],
    });
    await event.save();

    // emit real-time update
    io.emit("eventCreated", event);

    res.status(201).json({ message: "Event created successfully!", event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating the event!", error: error.message });
  }
};
