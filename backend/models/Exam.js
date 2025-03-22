import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  difficulty: { type: String, required: true },
  classOrDegree: { type: String, required: true },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  questions: [questionSchema],
  numQuestions: { type: Number, default: 0 },
  examDuration: { type: Number, required: true }, // Duration in minutes
  participants: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, required: true },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Middleware to update `numQuestions` before saving
examSchema.pre("save", function (next) {
  this.numQuestions = this.questions.length;
  next();
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
