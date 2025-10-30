import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Kunal_Pawar");

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Admins only" });
    }
    next();
  };
};



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjIwNGFkYTE3Y2IxZjViODg4N2NlOSIsImVtYWlsIjoia3VuYWxwYXdhcjkxMEBnbWFpbC5jb20iLCJpYXQiOjE3NjA5MzkyOTcsImV4cCI6MTc2MTU0NDA5N30.jOyNDWAsTaXKPCZDbyMyn7fSh86EUSbpWjnxAfSgVZY
