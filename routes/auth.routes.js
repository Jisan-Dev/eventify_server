import express from "express";
const router = express.Router();
// Importing controllers
import { register } from "../controllers/auth.controller.js";

// Routes
router.post("/register", register);

export default router;
