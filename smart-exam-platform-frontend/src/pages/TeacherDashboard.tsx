import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import TeacherSidebar from "./TeacherSidebar";

export default function TeacherDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <TeacherSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} p-8`}>
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800">
            Teacher Dashboard
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

        {/* Teacher Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700">Total Exams</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">12</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Students
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">245</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700">
              Average Score
            </h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">82%</p>
          </div>
        </section>

        {/* Recent Exams */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Exams
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
                <td className="p-3 text-gray-800">Math Quiz</td>
                <td className="p-3 text-gray-600">March 10, 2025</td>
                <td className="p-3 text-green-600 font-semibold">Completed</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">Physics Test</td>
                <td className="p-3 text-gray-600">March 12, 2025</td>
                <td className="p-3 text-yellow-600 font-semibold">Ongoing</td>
              </tr>
              <tr className="hover:bg-gray-50 transition duration-200">
                <td className="p-3 text-gray-800">English Exam</td>
                <td className="p-3 text-gray-600">March 15, 2025</td>
                <td className="p-3 text-red-600 font-semibold">Pending</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
