import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Institute from "../models/Institute.js";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Student Registration
router.post("/register-student", async (req, res) => {
  const { name, email, password, studentClass, instituteName, rollNo } =
    req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const institute = await Institute.findOne({ name: instituteName });
    if (!institute) {
      return res.status(400).json({ message: "Institute not found" });
    }

    const rollNoExists = await User.findOne({ rollNo });
    if (rollNoExists) {
      return res.status(400).json({ message: "Roll Number already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      studentClass,
      institute: institute._id,
      rollNo,
      role: "student",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentClass: user.studentClass,
        institute: institute.name,
        rollNo: user.rollNo,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid student data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Teacher Registration
router.post("/register-teacher", async (req, res) => {
  const { name, email, password, instituteName } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const institute = await Institute.findOne({ name: instituteName });
    if (!institute) {
      return res.status(400).json({ message: "Institute not found" });
    }

    const user = await User.create({
      name,
      email,
      password,
      institute: institute._id,
      role: "teacher",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        institute: institute.name,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid teacher data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Login (Common for Students & Teachers)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentClass: user.studentClass || null,
        institute: user.institute,
        rollNo: user.rollNo || null,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
