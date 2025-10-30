import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =============================
// REGISTER USER
// =============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const profilePhoto = req.file ? req.file.filename : "";

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      profilePhoto,
    });

    // const token = jwt.sign(
    //   { id: newUser._id, email: newUser.email },
    //   process.env.JWT_SECRET || "mysecretkey",
    //   { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    // );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      // user: {
      //   id: newUser._id,
      //   name: newUser.name,
      //   email: newUser.email,
      //   profilePhoto: newUser.profilePhoto,
      // },
      // token,
    });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// LOGIN USER
// =============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE PROFILE
// =============================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    const profilePhoto = req.file ? req.file.filename : req.user.profilePhoto;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, profilePhoto },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// UPDATE PASSWORD
// =============================
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(userId).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
