import express from "express";
import db from "../db.js";
import axios from "axios";

const router = express.Router();

// Helper: reverse geocode lat/lon
async function getPlaceName(lat, lon) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { format: 'json', lat, lon },
      headers: { 'User-Agent': 'CollegeBusTracker/1.0' }
    });

    const address = response.data.address;
    return address.village || address.town || address.city || address.county || "Unknown";
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return "Unknown";
  }
}

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371e3; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

// POST /api/attendance/mark
router.post("/mark", async (req, res) => {
  const { studentName, busNumber, studentLat, studentLon, busLat, busLon } = req.body;

  if (!studentName || !busNumber || !studentLat || !studentLon || !busLat || !busLon) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const distance = getDistance(studentLat, studentLon, busLat, busLon);

  // Optional: only allow marking if within 100m
  if (distance > 100) {
    return res.status(400).json({ success: false, message: "Student is too far from the bus" });
  }

  const placeName = await getPlaceName(studentLat, studentLon);

  const currentDate = new Date();
  const date = currentDate.toISOString().split('T')[0];    // YYYY-MM-DD
  const time = currentDate.toTimeString().split(' ')[0];   // HH:MM:SS

  const insertQuery = `
    INSERT INTO attendance (student_name, bus_number, date, time, location)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [studentName, busNumber, date, time, placeName], (err) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ success: false, message: "Failed to mark attendance" });
    }

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: { studentName, busNumber, date, time, location: placeName, distance }
    });
  });
});

export default router;
