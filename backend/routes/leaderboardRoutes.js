import express from "express";
import Exam from "../models/Exam.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Get Leaderboard with Pagination, Subject Filtering, and Time-based Rankings
 */
router.get("/", protect, async (req, res) => {
  try {
    const { institute, classOrDegree } = req.user;
    const { subject, timeFrame, page = 1, limit = 10 } = req.query;

    const filter = { institute, classOrDegree };
    if (subject) filter.subject = subject;

    if (timeFrame) {
      const now = new Date();
      let startDate;
      if (timeFrame === "7d")
        startDate = new Date(now.setDate(now.getDate() - 7));
      else if (timeFrame === "30d")
        startDate = new Date(now.setDate(now.getDate() - 30));
      if (startDate) filter.startTime = { $gte: startDate };
    }

    const exams = await Exam.find(filter);
    if (!exams.length) {
      return res.json({ message: "No exams found for leaderboard." });
    }

    const studentScores = {};

    exams.forEach((exam) => {
      exam.participants.forEach((participant) => {
        const { studentId, score } = participant;
        if (!studentScores[studentId]) {
          studentScores[studentId] = { totalScore: 0, examsAttempted: 0 };
        }
        studentScores[studentId].totalScore += score;
        studentScores[studentId].examsAttempted += 1;
      });
    });

    const studentIds = Object.keys(studentScores);
    const students = await User.find({ _id: { $in: studentIds } }).select(
      "name email rollNo"
    );

    const leaderboard = students.map((student) => ({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo, // 🆕 Include Roll No
      totalScore: studentScores[student._id].totalScore,
      examsAttempted: studentScores[student._id].examsAttempted,
    }));

    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    const paginatedLeaderboard = leaderboard.slice(
      (page - 1) * limit,
      page * limit
    );
    res.json({ leaderboard: paginatedLeaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Get Student Profile & Performance Analytics
 */
router.get("/profile", protect, async (req, res) => {
  try {
    const studentId = req.user._id;
    const exams = await Exam.find({ "participants.studentId": studentId });

    if (!exams.length) {
      return res.json({ message: "No exam records found for this student." });
    }

    let totalScore = 0;
    let examsAttempted = 0;
    let scoreHistory = [];

    exams.forEach((exam) => {
      const participant = exam.participants.find(
        (p) => p.studentId.toString() === studentId.toString()
      );
      if (participant) {
        totalScore += participant.score;
        examsAttempted += 1;
        scoreHistory.push({
          examId: exam._id,
          subject: exam.subject,
          score: participant.score,
          date: exam.startTime,
        });
      }
    });

    const averageScore =
      examsAttempted > 0 ? (totalScore / examsAttempted).toFixed(2) : 0;

    res.json({
      studentId,
      totalScore,
      examsAttempted,
      averageScore,
      scoreHistory,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Failed to fetch student profile" });
  }
});

export default router;
