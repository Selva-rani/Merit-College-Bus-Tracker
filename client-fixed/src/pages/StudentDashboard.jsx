import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function StudentDashboard() {
  const [busLocation, setBusLocation] = useState(null);
  const [status, setStatus] = useState("⏳ Waiting for bus location...");
  const [studentName, setStudentName] = useState("");
  const [busNumber, setBusNumber] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000");

    const name = localStorage.getItem("studentName");
    const bus = localStorage.getItem("busNumber");
    if (!name || !bus) {
      setStatus("❌ No student info found. Login first.");
      return;
    }
    setStudentName(name);
    setBusNumber(bus);

    socket.on("connect", () => {
      socket.emit("join_bus", { busNumber: bus, role: "student", studentName: name });
    });

    socket.on("bus_location", ({ latitude, longitude }) => {
      setBusLocation({ lat: latitude, lon: longitude });
      setStatus("✅ Bus location received");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p>Name: {studentName}</p>
      <p>Bus Number: {busNumber}</p>
      <p>Status: {status}</p>

      {busLocation ? (
        <iframe
          title="Bus Map"
          width="100%"
          height="400"
          src={`https://maps.google.com/maps?q=${busLocation.lat},${busLocation.lon}&z=15&output=embed`}
          className="rounded-lg mt-4"
        ></iframe>
      ) : (
        <p className="text-gray-500 mt-4">Waiting for bus location...</p>
      )}
    </div>
  );
}
