import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      console.log("Login successful:", data);
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err: unknown) {
      // Type guard to check if the error is an AxiosError
      if (err instanceof AxiosError && err.response) {
        setError(
          err.response.data.message ||
            "Login failed due to an unexpected error."
        );
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-gray-100">
      {/* Logo at the top */}
      <Link to="/" className="text-blue-600 font-medium hover:underline">
        <img src="/logo.png" alt="Smart Exam Platform" className="w-50" />
      </Link>

      <div className="bg-gradient-to-b from-blue-200 to-blue-100 p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-blue-600 text-center">Login</h2>
        <p className="text-gray-600 text-center mt-2">
          Welcome back! Please log in to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black focus:border-black focus:ring-black"
            />
          </div>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold mt-4 hover:bg-yellow-500"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
