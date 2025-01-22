import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/event.controller.js";
import { authenticateUser, isNotGuest } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Public routes (accessible by all authenticated users including guests)
router.get("/", authenticateUser, getAllEvents);
router.get("/:id", authenticateUser, getEventById);

// Protected routes (not accessible by guests)
router.post("/", authenticateUser, isNotGuest, createEvent);

export default router;
