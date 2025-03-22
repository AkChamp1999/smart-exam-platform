import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-gray-100 text-gray-900 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Smart Exam Platform Logo"
            className="h-30 w-auto"
          />
          <h1
            className="text-4xl font-bold text-blue-600"
            style={{ fontFamily: "Kanit, sans-serif" }}
          >
            Smart Exam Platform
          </h1>
        </div>
        <div>
          <Link to="/login">
            <Button variant="ghost" className="mr-4 text-blue-600">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="mr-4 bg-blue-500 text-white">Sign up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 mt-20">
        <h2 className="text-5xl font-bold">
          Turn your <span className="text-blue-600">exams</span> into success
          stories
        </h2>
        <p className="mt-4 text-lg max-w-2xl">
          Your ultimate tool for automated MCQ-based exams.
        </p>
      </main>

      {/* Feature Highlights */}
      <section className="mt-16 text-center px-6 max-w-4xl">
        <h3 className="text-3xl font-semibold text-blue-600">Why Choose Us?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="p-4 border border-blue-400 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">AI-Generated MCQs</h4>
            <p className="text-gray-700 mt-2">
              Automatically create quality questions in seconds.
            </p>
          </div>
          <div className="p-4 border border-blue-400 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">Instant Scoring</h4>
            <p className="text-gray-700 mt-2">
              Auto-evaluate student performance instantly.
            </p>
          </div>
          <div className="p-4 border border-blue-400 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">Leaderboard & Rankings</h4>
            <p className="text-gray-700 mt-2">
              Track top performers in class and institute-wide leaderboards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
