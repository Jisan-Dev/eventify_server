import express from "express";
const router = express.Router();
// Importing controllers
import { register, login } from "../controllers/auth.controller.js";

// Routes
router.post("/register", register);
router.get("/login", login);

export default router;
