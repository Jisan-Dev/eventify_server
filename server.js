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
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Eventify Event Management API" });
});

// Routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
