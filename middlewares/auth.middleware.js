import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized Access!" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found!" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token!" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized Access!" });
  next();
};
export const isNotGuest = (req, res, next) => {
  if (req.user.role === "guest") return res.status(403).json({ message: "Unauthorized Access!" });
  next();
};
