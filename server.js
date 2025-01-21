import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
import ConnectDb from "./config/ConnectDb.js";
ConnectDb();

// socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected to socket.");

  socket.on("disconnect", () => {
    console.log("User disconnected from socket");
  });
});

// httpServer.listen(3000, () => {
//   console.log(`socket Server is running on port 3000`);
// });

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
