import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent, registerTeacher } from "../api/auth";
import { AxiosError } from "axios";
import { fetchInstitutes } from "../api/institute";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [institute, setInstitute] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [institutes, setInstitutes] = useState<
    { id: string; name: string; city: string; state: string }[]
  >([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch the list of institutes when the component is mounted
  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const data = await fetchInstitutes();
        setInstitutes(data);
      } catch (err) {
        setError("Failed to fetch institutes.");
      }
    };

    getInstitutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        studentClass: role === "student" ? studentClass : "",
        instituteName: institute.split(" (")[0] || "",
        rollNo: role === "student" ? rollNo : "",
      };

      let data;
      if (role === "student") {
        data = await registerStudent(userData);
      } else {
        data = await registerTeacher(userData);
      }

      console.log("Sign up successful:", data);

      setSignupSuccess(true);
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Sign up failed.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setSignupSuccess(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-gray-100">
      {/* Logo at the top */}
      <Link to="/" className="text-blue-600 font-medium hover:underline">
        <img src="/logo.png" alt="Smart Exam Platform" className="w-40" />
      </Link>

      <div className="bg-gradient-to-b from-blue-200 to-blue-100 p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-blue-600 text-center">
          Sign Up
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Create an account to get started.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Role Selector (Student or Teacher) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Role
            </label>
            <select
              className="w-full border border-black focus:border-black focus:ring-black py-2 px-3 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value as "student" | "teacher")}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* First Row: Name, Email */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">
                Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-black focus:border-black focus:ring-black"
              />
            </div>
            <div className="w-1/2">
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
          </div>

          {/* Second Row: Password, Confirm Password */}
          <div className="flex space-x-4">
            <div className="w-1/2">
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
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-black focus:border-black focus:ring-black"
              />
            </div>
          </div>

          {/* Roll Number Input (for student only) */}
          {role === "student" && (
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Roll Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter your roll number"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="border border-black focus:border-black focus:ring-black"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Class
                </label>
                <Input
                  type="text"
                  placeholder="Enter your class"
                  required
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="border border-black focus:border-black focus:ring-black"
                />
              </div>
            </div>
          )}

          {/* Institute Dropdown for both Student and Teacher */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Institute
            </label>
            <select
              className="w-full border border-black focus:border-black focus:ring-black py-2 px-3 rounded-md"
              value={institute || ""}
              onChange={(e) => {
                setInstitute(e.target.value);
              }}
              required
            >
              <option value="">Select your institute</option>
              {institutes.length > 0 ? (
                institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.city}, {inst.state})
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold mt-4 hover:bg-yellow-500"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Success Modal */}
      {signupSuccess && (
        <AlertDialog open={signupSuccess} onOpenChange={setSignupSuccess}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign Up Successful 🎉</AlertDialogTitle>
              <p className="text-gray-600">
                You have successfully created your account. Click OK to proceed
                to login.
              </p>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleDialogClose}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
