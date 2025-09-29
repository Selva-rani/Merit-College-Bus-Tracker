import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/college-logo.png";
import NavbarAdmin from "../components/NavbarAdmin";
import axios from "axios";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const adminBusNumbers = JSON.parse(localStorage.getItem("managedBusNumbers") || "[]");

  // Fetch students & buses for this admin
  useEffect(() => {
    if (adminBusNumbers.length === 0) return;

    // Fetch students
    axios
      .get(`/api/admin/students?busNumbers=${adminBusNumbers.join(",")}`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));

    // Fetch buses
    axios
      .get(`/api/admin/buses?busNumbers=${adminBusNumbers.join(",")}`)
      .then((res) => setBuses(res.data))
      .catch((err) => console.log(err));
  }, [adminBusNumbers]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />

      <header className="flex items-center justify-between p-4 bg-blue-800 text-white shadow-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="College Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-2xl font-bold uppercase">Merit Arts and Science College</h1>
        </div>
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/admin-login";
          }}
        >
          Logout
        </button>
      </header>

      <main className="p-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
          Admin Control Panel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Students Card */}
          <Link
            to="/admin-students"
            className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-2">Manage Students</h3>
            <p className="text-gray-700">
              View, edit, and manage student records for your assigned buses.
            </p>
          </Link>

          {/* Buses Card */}
          <Link
            to="/admin-buses"
            className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-2xl font-bold mb-2">Manage Buses</h3>
            <p className="text-gray-700">
              View bus schedules, driver info, and routes assigned to you.
            </p>
          </Link>

          {/* Attendance Card */}
          <Link
            to="/admin-attendance"
            className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">View Attendance</h3>
            <p className="text-gray-700">
              Monitor attendance for your students and generate reports.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
