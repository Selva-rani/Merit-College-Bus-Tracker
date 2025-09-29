import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import busBg from "../assets/bus.png";

export default function Navbar() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${busBg})` }} 
    >
      {/* Overlay */}
      <div className="bg-black bg-opacity-60 w-full h-full">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 py-4 text-white font-semibold text-lg">
          {/* Logo + College Name */}
          <div className="flex items-center gap-2">
            <img
              src="/college-logo.png"
              alt="College Logo"
              className="w-21 h-20 rounded-full border border-white"
            />
            <span className="text-4xl md:text-4xl font-bold text-yellow-400">
              Merit Arts and Science College
            </span>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex gap-6 text-white font-medium">
            <Link to="/" className="hover:text-yellow-400">
              Home
            </Link>
            <Link to="/student-login" className="hover:text-yellow-400">
              Students
            </Link>
            <Link to="/parents-login" className="hover:text-yellow-400">
              Parents
            </Link>
            <Link to="/driver-login" className="hover:text-yellow-400">
              Drivers
            </Link>
            <Link to="/admin-login" className="hover:text-yellow-400">
              Admins
            </Link>
            
            <Link to="/about" className="hover:text-yellow-400">
               ℹ️ About
            </Link>
            <Link to="/help" className="hover:text-yellow-400">
              ❓ Help
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-white text-center h-[80vh] px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="text-yellow-400"> College Bus Tracking System</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl">
            Real-time tracking, instant alerts, and safe student transportation.
          </p>

          {/* Login Buttons are extended */}
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/student-login">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full">
                Student Login
              </Button>
            </Link>
            <Link to="/parents-login">
              <Button className="bg-pink-500 hover:bg-pink-600 text-black font-bold px-6 py-3 rounded-full">
                Parents Login
              </Button>
            </Link> {/*link drivers login and home page*/}
            <Link to="/driver-login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full">
                Driver Login
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
