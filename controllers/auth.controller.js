import "dotenv/config";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const user = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email: user.email });
    if (existing) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create new user
    const newUser = new User(user);
    await newUser.save();

    // generate jwt token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ message: "User registered successfully!", token, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user!", error: error.message });
  }
};
