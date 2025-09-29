import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import collegeLogo from "../assets/college-logo.png";
import collegeBg from "../assets/clg-logo.png";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    // Check password locally
    if (password === "merit1809") {
      alert("Login successful");
      localStorage.setItem("adminUsername", username);
      navigate("/admin-dashboard");
    } else {
      alert("Invalid password. Please enter the correct password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={collegeLogo} alt="College Logo" className="w-16 h-16 mb-3" />
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            MERIT ARTS AND SCIENCE COLLEGE
          </h1>
          <p className="text-gray-600 text-sm">Admin Login Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
