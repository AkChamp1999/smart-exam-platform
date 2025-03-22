import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiLogOut,
  FiBarChart,
  FiClipboard,
  FiMenu,
} from "react-icons/fi";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

export default function TeacherSidebar({
  isSidebarOpen,
  toggleSidebar,
  handleLogout,
}: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "bg-blue-500 text-white" : "text-gray-900";

  return (
    <aside
      className={`bg-gradient-to-br from-blue-300 to-gray-100 text-gray-900 h-full fixed transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <button
          className="text-gray-900 p-2 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={toggleSidebar}
        >
          <FiMenu className="text-2xl" />
        </button>
        {isSidebarOpen && (
          <img
            src="/logo.png"
            alt="Smart Exam Platform Logo"
            className="h-20 w-auto"
          />
        )}
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 space-y-2 p-4">
        <Link
          to="/teacher-dashboard"
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ${isActive(
            "/teacher-dashboard"
          )}`}
        >
          <FiHome className="text-2xl" />
          {isSidebarOpen && <span className="text-lg">Dashboard</span>}
        </Link>
        <Link
          to="/teacher-exams"
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ${isActive(
            "/teacher-exams"
          )}`}
        >
          <FiClipboard className="text-2xl" />
          {isSidebarOpen && <span className="text-lg">Exams</span>}
        </Link>
        <Link
          to="/leaderboard"
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ${isActive(
            "/leaderboard"
          )}`}
        >
          <FiBarChart className="text-2xl" />
          {isSidebarOpen && <span className="text-lg">Leaderboard</span>}
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition duration-200 w-full"
        >
          <FiLogOut className="text-2xl" />
          {isSidebarOpen && <span className="text-lg">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
