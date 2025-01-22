import express from "express";
import { createEvent } from "../controllers/event.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authenticateUser, createEvent);

export default router;
