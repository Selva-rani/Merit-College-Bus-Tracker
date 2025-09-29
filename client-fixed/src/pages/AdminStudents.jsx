import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarAdmin from "../components/NavbarAdmin";

const AdminStudents = () => {
  const [studentsByBus, setStudentsByBus] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
       const response = await axios.get("http://localhost:5000/api/admin-students/studentsByBus");

        setStudentsByBus(response.data || {});
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleRemove = async (busNumber, studentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${studentId}`);
      const updatedBus = (studentsByBus[busNumber] || []).filter(s => s.id !== studentId);
      setStudentsByBus({ ...studentsByBus, [busNumber]: updatedBus });
    } catch (err) {
      console.error("Error removing student:", err);
    }
  };

  const formatBusName = (busCode) => {
    const mapping = {
      BUS101: "Bus 1",
      BUS102: "Bus 2",
      BUS103: "Bus 3",
      BUS104: "Bus 4",
      BUS105: "Bus 5",
      BUS106: "Bus 6",
      BUS107: "Bus 7",
    };
    return mapping[busCode] || busCode;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin />
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📚 Students List by Bus</h1>

        {Object.entries(studentsByBus).map(([busNumber, students]) => (
          <div key={busNumber} className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">{formatBusName(busNumber)}</h2>
            <div className="overflow-x-auto shadow rounded bg-white p-4">
              <table className="min-w-full table-auto">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Department</th>
                    <th className="py-2 px-4 text-left">Year</th>
                    <th className="py-2 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(!students || students.length === 0) ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">No students assigned to this bus.</td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="py-2 px-4">{s.id}</td>
                        <td className="py-2 px-4">{s.name}</td>
                        <td className="py-2 px-4">{s.department}</td>
                        <td className="py-2 px-4">{s.year}</td>
                        <td className="py-2 px-4 text-center">
                          <button
                            onClick={() => handleRemove(busNumber, s.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminStudents;
