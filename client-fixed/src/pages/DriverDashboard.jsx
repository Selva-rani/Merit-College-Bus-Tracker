import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDriver from "../components/NavbarDriver";
import logo from "../assets/college-logo.png";

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDriver = JSON.parse(localStorage.getItem("driver"));
    if (!savedDriver || !savedDriver.bus_number) {
      navigate("/driver-login");
      return;
    }

    setDriver(savedDriver);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("driver");
    navigate("/driver-login");
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-green-50 to-blue-50">
      <NavbarDriver />

      <header className="bg-green-900 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <img src={logo} alt="College Logo" className="w-16 h-16 rounded-full shadow-md" />
          <h1 className="text-4xl font-extrabold">Merit Arts and Science College</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-10 space-y-12">
        {/* 🚍 Bus Info Card */}
        <section className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🚍 Bus Information</h2>
          <div className="text-lg space-y-3">
            <p><strong>Bus Number:</strong> {driver.bus_number}</p>
            <p><strong>Route Name:</strong> {driver.route_name}</p>
            <p><strong>Driver Name:</strong> {driver.driver_name}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
