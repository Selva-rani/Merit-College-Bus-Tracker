import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarDriver from "../components/NavbarDriver";

export default function ManualAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students for the logged-in driver
  useEffect(() => {
    const savedDriver = JSON.parse(localStorage.getItem("driver"));
    if (!savedDriver?.bus_number) return setLoading(false);

    axios
      .get(`http://localhost:5000/api/manual-attendance/students/${savedDriver.bus_number}`)
      .then((res) => {
        // Add present flag for each student
        setStudents(res.data.map((s) => ({ ...s, present: false })));
      })
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handle marking a student present
  const handleMarkPresent = async (student) => {
    const savedDriver = JSON.parse(localStorage.getItem("driver"));
    if (!savedDriver?.bus_number) return alert("Driver info missing!");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/manual-attendance/mark",
        {
          student_name: student.name,
          bus_number: savedDriver.bus_number,
          department: student.department,
          year: student.year,
          type: "manual",
        }
      );

      if (res.data.success) {
        // Update local state immediately
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, present: true } : s))
        );
      } else {
        alert("⚠️ " + res.data.message);
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("❌ Failed to mark attendance. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
      <NavbarDriver />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          📝 Manual Attendance
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading students...</p>
        ) : students.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-700">
            No students assigned to this bus.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Year
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">{student.name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.department}</td>
                    <td className="px-6 py-4 text-gray-600">{student.year}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleMarkPresent(student)}
                        disabled={student.present}
                        className={`px-4 py-2 rounded text-white font-semibold ${
                          student.present
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {student.present ? "Present ✅" : "Mark Present"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
