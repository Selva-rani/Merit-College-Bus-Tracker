import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {
  const [busNumber, setBusNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedBusNumber = busNumber.trim();
    const trimmedPassword = password.trim();

    if (!trimmedBusNumber || !trimmedPassword) {
      alert("Bus number and password are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/driver/driver-login",
        { busNumber: trimmedBusNumber, password: trimmedPassword }
      );

      const driver = response.data.driver;
      localStorage.setItem("driver", JSON.stringify(driver));
      alert(`Login successful!\nDriver: ${driver.driver_name}\nBus Number: ${driver.bus_number}\nRoute: ${driver.route_name}`);
      navigate("/driver-dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed. Check bus number and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <img src="/college-logo.png" alt="College Logo" className="w-40 h-40 mb-6 drop-shadow-lg rounded-full" />
          <h1 className="text-2xl font-extrabold text-indigo-800 tracking-wide text-center drop-shadow-sm">
            Merit Arts and Science College
          </h1>
          <p className="text-gray-600 font-bold">Driver Login Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-indigo-900 text-sm font-semibold mb-1">Bus Number</label>
            <input
              type="text"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              placeholder="e.g., BUS101"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-indigo-900 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
