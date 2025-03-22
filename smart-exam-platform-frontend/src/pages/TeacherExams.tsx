import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";

export default function TeacherExams() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  // Dummy exams data
  const [exams] = useState([
    { id: 1, name: "Math Quiz", date: "March 10, 2025", status: "Completed" },
    { id: 2, name: "Physics Test", date: "March 12, 2025", status: "Ongoing" },
    { id: 3, name: "English Exam", date: "March 15, 2025", status: "Pending" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800">Manage Exams</h2>
          <div className="flex items-center space-x-6">
            <Link
              to="/create-exam"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              + Create New Exam
            </Link>
          </div>
        </header>

        {/* Exams Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Upcoming & Past Exams
          </h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700">Exam Name</th>
                <th className="p-3 text-left text-gray-700">Date</th>
                <th className="p-3 text-left text-gray-700">Status</th>
                <th className="p-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr
                  key={exam.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3 text-gray-800">{exam.name}</td>
                  <td className="p-3 text-gray-600">{exam.date}</td>
                  <td
                    className={`p-3 font-semibold ${
                      exam.status === "Completed"
                        ? "text-green-600"
                        : exam.status === "Ongoing"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {exam.status}
                  </td>
                  <td className="p-3">
                    <button className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline ml-4">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
