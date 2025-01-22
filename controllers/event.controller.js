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

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("creator", "username").populate("attendees", "username");
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching the event!", error: error.message });
  }
};

export const attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found!" });

    // check if user already attending
    if (event.attendees.includes(req.user._id)) return res.status(400).json({ message: "Already attending this event" });

    // event.attendees.push(req.user._id)
    // await event.save()

    // If we need to return the updated document with response
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { $push: { attendees: req.user._id } }, { new: true }).populate("creator", "username");

    // emit real-time update
    io.emit("eventUpdated", updatedEvent);

    res.status(201).json({ message: "Successfully registered for the event", event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering for the event!", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    // Check if user is the creator or admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role.toString() !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    // emit real-time update
    io.emit("eventDeleted", req.params.id);

    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting the event!", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    // Check if user is the creator or admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role.toString() !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate("creator", "username").populate("attendees", "username");

    // emit real-time update
    io.emit("eventUpdated", updatedEvent);

    res.status(200).json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating the event!", error: error.message });
  }
};
