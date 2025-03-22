import express from "express";
import Institute from "../models/Institute.js";

const router = express.Router();

// Route to get all institutes
router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.json(institutes);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
