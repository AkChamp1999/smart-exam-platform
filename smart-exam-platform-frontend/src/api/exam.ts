import { Question } from "../types/Question";

const API_HOST_URL = import.meta.env.VITE_API_HOST_URL;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.token || "";
};

// ✅ Generate Questions (Protected API)
export const generateQuestions = async (
  subject: string,
  numQuestions: number,
  difficulty: string,
  classOrDegree: string,
  sessionId: string // ✅ Include sessionId
) => {
  try {
    const response = await fetch(`${API_HOST_URL}/exams/generate-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        subject,
        numberOfQuestions: numQuestions,
        difficulty,
        classOrDegree,
        sessionId, // ✅ Required for unique questions
      }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to generate questions");

    return data.questions;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unexpected error"
    );
  }
};

// ✅ Publish Exam (Protected API)
export const publishExam = async (
  subject: string,
  difficulty: string,
  classOrDegree: string,
  questions: Question[],
  examDuration: number
) => {
  try {
    const response = await fetch(`${API_HOST_URL}/exams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        subject,
        difficulty,
        classOrDegree,
        questions,
        examDuration, // Send duration instead of start/end time
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to publish exam");
    }

    return await response.json();
  } catch (error) {
    console.error("Publish Exam Error:", error);
    throw error;
  }
};
