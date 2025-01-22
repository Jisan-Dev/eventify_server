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

export const getAllEvents = async (req, res) => {
  try {
    const { category, date } = req.query;
    let query = {};

    // apply filters if provided
    if (category) query.category = category;
    if (date) query.date = { $gte: new Date(date) };

    const events = await Event.find(query).populate("creator", "username").populate("attendees", "username").sort({ date: 1 });

    res.status(200).json({ events, count: events.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching all events!", error: error.message });
  }
};
