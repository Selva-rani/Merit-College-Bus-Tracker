// AdminAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { io } from "socket.io-client";
import NavbarAdmin from "../components/NavbarAdmin";

const socket = io("http://localhost:5000");

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchAttendance = async (date) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin-attendance?date=${date}`);
      // Do NOT filter, show all types
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    fetchAttendance(dateStr);

    // Real-time updates
    socket.on("attendance-updated", (data) => {
      const updateDate = new Date().toISOString().split("T")[0];
      if (data.date === updateDate) {
        setAttendance((prev) => [...prev, data]);
      }
    });

    return () => socket.off("attendance-updated");
  }, [selectedDate]);

  const grouped = attendance.reduce((acc, rec) => {
    acc[rec.bus_number] = acc[rec.bus_number] || [];
    acc[rec.bus_number].push(rec);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
          📋 Admin Daily Attendance Dashboard
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex justify-center">
          <Calendar value={selectedDate} onChange={setSelectedDate} />
        </div>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500">
            No attendance recorded for {selectedDate.toDateString()}.
          </p>
        ) : (
          Object.entries(grouped).map(([busNumber, records]) => (
            <div key={busNumber} className="mb-8 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">🚌 Bus Number: {busNumber}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-gray-300">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} className="border-t hover:bg-gray-100">
                        <td>{r.student_name}</td>
                        <td>{r.department || "-"}</td>
                        <td>{r.year || "-"}</td>
                        <td>{r.time}</td>
                        <td>{r.location || "-"}</td>
                        <td>{r.type === "manual" ? "Manual" : "Automatic"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
