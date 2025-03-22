import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedAnswer: { type: String, required: true },
    },
  ],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  start_time: { type: Date, required: true, default: Date.now }, // Start time when student begins exam
  end_time: { type: Date, required: true }, // Dynamically calculated
  createdAt: { type: Date, default: Date.now },
});

// Middleware to set `end_time` dynamically based on exam duration
attemptSchema.pre("save", async function (next) {
  if (!this.end_time) {
    const exam = await mongoose.model("Exam").findById(this.exam);
    if (exam) {
      this.end_time = new Date(
        this.start_time.getTime() + exam.examDuration * 60000
      );
    }
  }
  next();
});

const Attempt = mongoose.model("Attempt", attemptSchema);
export default Attempt;
