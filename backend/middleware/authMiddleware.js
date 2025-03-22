import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// ✅ Middleware to protect routes (only logged-in users)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// ✅ Middleware to allow only teachers
const teacherProtect = asyncHandler(async (req, res, next) => {
  await protect(req, res, async () => {
    if (req.user.role === "teacher") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Teachers only." });
    }
  });
});

export const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ message: "Only teachers can perform this action" });
  }
};

export { protect, teacherProtect };
