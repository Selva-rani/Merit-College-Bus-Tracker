import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ParentLogin() {
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/parents/login", {
        parentName,
        studentName,
        busNumber,
        password,
      });

      setSuccess(true);
      setMessage("✅ Login successful!");

      localStorage.setItem("parentName", parentName);
      localStorage.setItem("studentName", studentName);
      localStorage.setItem("busNumber", busNumber.toUpperCase());

      setTimeout(() => {
        navigate("/parent-dashboard", {
          state: { parentName, studentName, busNumber }
        });
      }, 1500);

    } catch (error) {
      console.error(error.response?.data || error.message);
      setSuccess(false);
      setMessage("❌ Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 overflow-hidden">
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-ping"></div>

      <div className="relative z-10 bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <img
          src="/college-logo.png"
          alt="College Logo"
          className="w-40 h-50 mx-auto mb-6 rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-extrabold text-blue-700 mb-3">
          Merit Arts & Science College
        </h1>
        <h2 className="text-lg font-semibold mb-6 text-blue-900">
          👨‍👩‍👧 Parent Bus Tracking Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Parent Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Enter Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Enter Bus Number (e.g., BUS101)"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition duration-300"
          >
            🚍 Login
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 font-semibold text-sm ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ParentLogin;
