import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export const generateMCQs = async (
  subject,
  numberOfQuestions,
  difficulty,
  classOrDegree,
  previousQuestions = new Set()
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
  const previousQuestionsList = Array.from(previousQuestions);

  const prompt = `
        Generate ${numberOfQuestions} unique multiple-choice questions (MCQs) for "${subject}" 
        at "${difficulty}" level for "${classOrDegree}" students.

        Ensure all questions are **completely unique** and **not similar** to any of the following previously generated questions:
        ${
          previousQuestionsList.length > 0
            ? previousQuestionsList.map((q, i) => `${i + 1}. ${q}`).join("\n")
            : "No previous questions"
        }

        Each MCQ must have:
        - A clear question
        - 4 answer options labeled A, B, C, D
        - 1 correct answer indicated
        
        Provide the output in **pure JSON format**, without markdown or code blocks:
        [
            {
                "question": "What is ...?",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": "B"
            }
        ]
    `;

  try {
    const result = await model.generateContent([prompt]);
    let text = result.response.candidates[0]?.content?.parts[0]?.text || "";

    console.log("Result from Gemini:", text);

    // Remove Markdown formatting
    text = text.replace(/```json|```/g, "").trim();

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(text);
      if (!Array.isArray(generatedQuestions)) {
        throw new Error("Invalid JSON format: Expected an array.");
      }
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      return { error: "Invalid AI response format." };
    }

    // Filter out duplicate questions
    generatedQuestions = generatedQuestions.filter(
      (q) => !previousQuestions.has(q.question)
    );

    // If not enough questions, generate more
    if (generatedQuestions.length < numberOfQuestions) {
      console.log(
        `Duplicate removal reduced count to ${generatedQuestions.length}, generating more...`
      );
      const additionalMCQs = await generateMCQs(
        subject,
        numberOfQuestions - generatedQuestions.length,
        difficulty,
        classOrDegree,
        new Set([
          ...previousQuestions,
          ...generatedQuestions.map((q) => q.question),
        ])
      );
      generatedQuestions.push(...additionalMCQs);
    }

    return Array.isArray(generatedQuestions) ? generatedQuestions : [];
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    return { error: "Failed to generate MCQs" };
  }
};
