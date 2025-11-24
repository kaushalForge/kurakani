// controllers/userController.js
import User from "../models/User.js";
import dbConnection from "../lib/dbConnection.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { genToken } from "../utils/generateToken.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

// SIGN UP USER
export const signUpUser = async (req, res) => {
  try {
    await dbConnection();

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ warning: "Password too short!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password: await hashPassword(password),
    });

    res.status(201).json({ message: "Account created!", user: newUser });
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// SIGN IN USER
export const signInUser = async (req, res) => {
  try {
    await dbConnection();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ warning: "Invalid credentials!" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ warning: "Invalid credentials!" });
    }

    const token = genToken({ email: user.email });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      message: "Login successful!",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    await dbConnection();

    const { email, oldPassword, newPassword } = req.body;
    const profilePicture = req.file; // multer file
    const user = req.user; // set by auth middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required!" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    if (newPassword && (await comparePassword(newPassword, user.password))) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password!" });
    }

    let profileChanged = false;
    if (profilePicture) {
      profileChanged = true;

      // Convert buffer to Base64 URI if using memoryStorage
      const fileBase64 = `data:${
        profilePicture.mimetype
      };base64,${profilePicture.buffer.toString("base64")}`;

      let oldPublicId = null;
      if (user.profilePicture) {
        const parts = user.profilePicture.split("/");
        const fileName = parts[parts.length - 1].split(".")[0];
        oldPublicId = `Kurakani/profilePictures/${fileName}`;
      }

      const cloudUpload = await uploadToCloudinary(
        oldPublicId,
        fileBase64,
        "Kurakani/profilePictures"
      );

      user.profilePicture = cloudUpload.secure_url;
    }

    const emailChanged = email && email !== user.email;
    const passwordChanged = newPassword && newPassword !== "";

    if (!emailChanged && !passwordChanged && !profileChanged) {
      return res.status(200).json({ message: "No changes detected!" });
    }

    if (emailChanged) user.email = email;
    if (passwordChanged) user.password = await hashPassword(newPassword);

    await user.save();

    const { password, ...safeUser } = user.toObject();
    res.status(200).json({ message: "Account Updated!", user: safeUser });
  } catch (err) {
    console.error("User update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
