import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { generateQuestions, publishExam } from "../api/exam";
import { Question } from "../types/Question";
import { v4 as uuidv4 } from "uuid"; // ✅ Unique session ID
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { ScaleLoader } from "react-spinners"; // ✅ React loader
import { ToastContainer, toast } from "react-toastify"; // ✅ React Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS

export default function CreateExam() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");
  const [classOrDegree, setClassOrDegree] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examDuration, setExamDuration] = useState<number>(numQuestions);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  useEffect(() => {
    setExamDuration(questions.length);
  }, [questions]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Validation function
  const validateForm = () => {
    if (!subject.trim()) return "Subject is required!";
    if (!classOrDegree.trim()) return "Class or Degree is required!";
    if (numQuestions <= 0) return "Number of questions must be greater than 0!";
    return null;
  };

  // ✅ Clear Form & Questions
  const handleClearForm = () => {
    setSubject("");
    setNumQuestions(10);
    setDifficulty("Medium");
    setClassOrDegree("");
    setQuestions([]); // ✅ Remove displayed questions
  };

  // ✅ Generate AI-Based Questions
  const handleGenerateQuestions = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError); // ❌ Show error toast
      return;
    }

    setLoading(true);
    try {
      const newQuestions: Question[] = await generateQuestions(
        subject,
        numQuestions,
        difficulty,
        classOrDegree,
        sessionId
      );

      setQuestions((prevQuestions) => {
        const uniqueQuestions = newQuestions.filter(
          (newQ) =>
            !prevQuestions.some((prevQ) => prevQ.question === newQ.question)
        );
        return [...prevQuestions, ...uniqueQuestions];
      });

      if (newQuestions.length === 0) {
        toast.warn("No new unique questions were generated. Try again!");
      } else {
        toast.success("Questions generated successfully!"); // ✅ Success toast
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Specific Question
  const handleDeleteQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
    toast.info("Question deleted."); // 🔹 Info toast
  };

  // ✅ Publish Exam
  const handlePublishExam = async () => {
    if (questions.length === 0 || examDuration <= 0) {
      toast.error("Cannot publish an exam without questions or duration!");
      return;
    }

    setLoading(true);
    setPublishDialogOpen(false);
    try {
      await publishExam(
        subject,
        difficulty,
        classOrDegree,
        questions,
        examDuration
      );
      toast.success("Exam Published Successfully!"); // ✅ Success toast
      navigate("/teacher-exams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Sidebar */}
      <TeacherSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        handleLogout={handleLogout}
      />

      <div
        className={`flex-1 transition-all duration-300 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800">Create New Exam</h2>
        </header>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Exam Details
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border p-3 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="border p-3 rounded-lg w-full"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                placeholder="Number of Questions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="border p-3 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Class or Degree
              </label>
              <input
                type="text"
                placeholder="Class or Degree"
                value={classOrDegree}
                onChange={(e) => setClassOrDegree(e.target.value)}
                className="border p-3 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Exam Duration (minutes)
              </label>
              <input
                type="number"
                placeholder="Exam Duration (minutes)"
                value={examDuration}
                onChange={(e) => setExamDuration(Number(e.target.value))}
                className="border p-3 rounded-lg w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGenerateQuestions}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>
            <button
              onClick={handleClearForm}
              className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Clear Form
            </button>
          </div>
        </div>

        {/* Centered Loading Spinner */}

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <ScaleLoader color="#3b82f6" />
          </div>
        )}

        {/* Generated Questions */}
        {questions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Generated Questions ({questions.length})
            </h3>
            <ul className="list-decimal pl-6">
              {questions.map((question, index) => (
                <li key={index} className="flex flex-col p-3 border-b">
                  <span className="font-semibold">
                    {index + 1}. {question.question}
                  </span>

                  <ul className="pl-6 mt-2">
                    {question.options.map((option, i) => (
                      <li key={i} className="flex items-center">
                        <span className="font-semibold mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{option}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    className="text-red-500 hover:underline mt-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* ShadCN Alert Dialog for Publish Exam */}
            <AlertDialog
              open={publishDialogOpen}
              onOpenChange={setPublishDialogOpen}
            >
              <AlertDialogTrigger className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg mt-6">
                Publish Exam
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Confirm Publish</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish this exam?
                </AlertDialogDescription>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlePublishExam}>
                  Yes, Publish
                </AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
