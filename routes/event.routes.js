import express from "express";
import { createEvent } from "../controllers/event.controller.js";
import { authenticateUser, isNotGuest } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authenticateUser, isNotGuest, createEvent);

export default router;
