import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dbConnect from "../lib/dbConnection.js";
// Middleware to protect routes
export const isLoggedIn = async (req, res, next) => {
  await dbConnect();
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "You must be logged in!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ Attach the user to req so next handlers can access it
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
