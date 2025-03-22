import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";

export default function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h2>
          <div className="flex items-center space-x-6">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaUserCircle className="text-4xl text-gray-700 cursor-pointer hover:text-blue-600 transition duration-200" />
          </div>
        </header>

        {/* Student Performance Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700">Total Exams</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">8</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700">
              Average Score
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">76%</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700">
              Leaderboard Rank
            </h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">#5</p>
          </div>
        </section>

        {/* Upcoming Exams */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Upcoming Exams
          </h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700">Exam Name</th>
                <th className="p-3 text-left text-gray-700">Date</th>
                <th className="p-3 text-left text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">Science Test</td>
                <td className="p-3 text-gray-600">March 15, 2025</td>
                <td className="p-3 text-yellow-600 font-semibold">Scheduled</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">History Quiz</td>
                <td className="p-3 text-gray-600">March 18, 2025</td>
                <td className="p-3 text-yellow-600 font-semibold">Scheduled</td>
              </tr>
              <tr className="hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">Math Exam</td>
                <td className="p-3 text-gray-600">March 20, 2025</td>
                <td className="p-3 text-yellow-600 font-semibold">Scheduled</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
