import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
import ConnectDb from "./config/ConnectDb.js";
ConnectDb();

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Eventify Event Management API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
