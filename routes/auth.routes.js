import express from "express";
const router = express.Router();
// Importing controllers
import { register, login, guestLogin } from "../controllers/auth.controller.js";

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/guest-login", guestLogin);

export default router;
