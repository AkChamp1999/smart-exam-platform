import express from "express";
import Attempt from "../models/Attempt.js";
import Exam from "../models/Exam.js";
import { protect } from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

// ✅ Student submits exam answers (Prevents multiple submissions)
router.post("/:examId/submit", protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const examId = req.params.examId;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Check if student already attempted this exam
    const existingAttempt = await Attempt.findOne({
      student: req.user._id,
      exam: examId,
    });
    if (existingAttempt) {
      return res
        .status(400)
        .json({ message: "You have already submitted this exam." });
    }

    let score = 0;

    // Auto-grading logic
    exam.questions.forEach((question) => {
      const studentAnswer = answers.find(
        (ans) => ans.questionId === question._id.toString()
      );
      if (
        studentAnswer &&
        studentAnswer.selectedAnswer === question.correctAnswer
      ) {
        score += 1;
      }
    });

    // Save attempt
    const newAttempt = new Attempt({
      student: req.user._id,
      exam: examId,
      answers,
      score,
      totalQuestions: exam.questions.length,
    });

    await newAttempt.save();
    res.status(201).json({
      message: "Exam submitted",
      score,
      totalQuestions: exam.questions.length,
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get student's attempts
router.get("/", protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id }).populate(
      "exam",
      "title subject"
    );
    res.json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get student's result for a specific exam
router.get("/:examId/result", protect, async (req, res) => {
  try {
    const examId = req.params.examId;
    const attempt = await Attempt.findOne({
      student: req.user._id,
      exam: examId,
    });

    if (!attempt) {
      return res
        .status(404)
        .json({ message: "No attempt found for this exam." });
    }

    res.json(attempt);
  } catch (error) {
    console.error("Error fetching exam result:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Teacher review: Get all attempts for a specific exam
router.get("/exam/:examId/attempts", protect, async (req, res) => {
  try {
    const examId = req.params.examId;
    const attempts = await Attempt.find({ exam: examId }).populate(
      "student",
      "name email rollNo"
    );

    if (!attempts.length) {
      return res.json({ message: "No attempts found for this exam." });
    }

    res.json(attempts);
  } catch (error) {
    console.error("Error fetching attempts for exam:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
