import express from "express";
import Exam from "../models/Exam.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";
import { generateMCQs } from "../utils/aiHelper.js"; // AI question generation logic
import Institute from "../models/Institute.js";

const router = express.Router();

// Store previously generated questions for each session
const previousQuestionsMap = new Map();

/**
 * ✅ Generate AI-Based Questions (Ensures Unique Questions)
 */
router.post("/generate-questions", protect, teacherOnly, async (req, res) => {
  console.log("Request:", req.body);
  const { subject, numberOfQuestions, difficulty, classOrDegree, sessionId } =
    req.body;

  if (
    !subject ||
    !numberOfQuestions ||
    !difficulty ||
    !classOrDegree ||
    !sessionId
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required, including sessionId" });
  }

  // Retrieve existing session questions or initialize a new set
  let previousQuestions = previousQuestionsMap.get(sessionId) || new Set();

  try {
    const questions = await generateMCQs(
      subject,
      numberOfQuestions,
      difficulty,
      classOrDegree,
      previousQuestions
    );

    // Update session's previous questions
    questions.forEach((q) => previousQuestions.add(q.question));
    previousQuestionsMap.set(sessionId, previousQuestions);

    res.json({ message: "Questions generated successfully", questions });
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
});

/**
 * ✅ Create an Exam with Scheduling
 */
router.post("/", protect, teacherOnly, async (req, res) => {
  const { subject, difficulty, classOrDegree, questions, examDuration } =
    req.body;

  const institute = await Institute.findById(req.user.institute);
  if (!institute) {
    return res.status(400).json({ message: "Institute not found" });
  }

  if (
    !subject ||
    !difficulty ||
    !classOrDegree ||
    !questions ||
    questions.length === 0 ||
    !examDuration
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exam = await Exam.create({
      subject,
      difficulty,
      classOrDegree,
      institute: institute._id,
      questions,
      numQuestions: questions.length,
      createdBy: req.user._id,
      examDuration, // Store only duration
    });

    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ message: "Failed to create exam" });
  }
});

/**
 * ✅ Get Exams Relevant to a Student
 */
router.get("/exams", protect, async (req, res) => {
  try {
    const student = req.user;
    const now = new Date();

    const exams = await Exam.find({
      classOrDegree: student.classOrDegree,
      institute: student.institute,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    res.json(exams);
  } catch (error) {
    console.error("Error fetching relevant exams:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:examId/start", protect, async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + exam.examDuration * 60000);

    const attempt = await Attempt.create({
      student: req.user._id,
      exam: examId,
      answers: [],
      score: 0,
      totalQuestions: exam.numQuestions,
      start_time: startTime,
      end_time: endTime,
    });

    res.status(201).json({ message: "Exam attempt started", attempt });
  } catch (error) {
    console.error("Start Exam Attempt Error:", error);
    res.status(500).json({ message: "Failed to start exam attempt" });
  }
});

/**
 * ✅ Get Single Exam by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Notifications for Upcoming Exams
 */
router.get("/notifications", protect, async (req, res) => {
  try {
    const student = req.user;
    const now = new Date();

    const upcomingExams = await Exam.find({
      classOrDegree: student.classOrDegree,
      institute: student.institute,
      startTime: { $gt: now },
    });

    res.json({ message: "Upcoming exams", upcomingExams });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
