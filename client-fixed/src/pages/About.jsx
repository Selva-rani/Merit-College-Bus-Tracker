import React from "react";

export default function About() {
  // Get user info from localStorage (adjust key based on who is logged in)
  const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
  const parentInfo = JSON.parse(localStorage.getItem("parentInfo"));
  const driverInfo = JSON.parse(localStorage.getItem("driverInfo"));
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  const user =
    studentInfo || parentInfo || driverInfo || adminInfo || null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        ℹ️ About LoginInfo
      </h1>

      {/* User Login Details */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          👤 Logged-in User Information
        </h2>

        {user ? (
          <div className="space-y-2">
            {user.student_name && (
              <p><strong>Student Name:</strong> {user.student_name}</p>
            )}
            {user.parent_name && (
              <p><strong>Parent Name:</strong> {user.parent_name}</p>
            )}
            {user.driver_name && (
              <p><strong>Driver Name:</strong> {user.driver_name}</p>
            )}
            {user.email && (
              <p><strong>Admin Email:</strong> {user.email}</p>
            )}
            {user.bus_number && (
              <p><strong>Bus Number:</strong> {user.bus_number}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No user logged in.</p>
        )}
      </div>

      
    </div>
  );
}
