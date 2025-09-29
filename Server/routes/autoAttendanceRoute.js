import express from "express";
import db from "../db.js";
import haversine from "haversine-distance";

const router = express.Router();

// POST /api/attendance/auto
router.post("/auto", async (req, res) => {
  try {
    const { busNumber } = req.body;

    if (!busNumber) return res.status(400).json({ success: false, message: "Bus number required" });

    // 1️⃣ Get current bus location
    const [busData] = await db
      .promise()
      .query("SELECT latitude, longitude FROM live_locations WHERE bus_number = ?", [busNumber]);

    if (busData.length === 0) {
      return res.status(404).json({ success: false, message: "Bus location not found" });
    }

    const busLat = parseFloat(busData[0].latitude);
    const busLon = parseFloat(busData[0].longitude);

    // 2️⃣ Get students assigned to this bus
    const [students] = await db
      .promise()
      .query("SELECT name, lat, lon FROM students WHERE bus_number = ?", [busNumber]);

    const markedStudents = [];

    for (let student of students) {
      const stopLat = parseFloat(student.lat);
      const stopLon = parseFloat(student.lon);

      if (!stopLat || !stopLon) continue;

      const distance = haversine(
        { lat: busLat, lon: busLon },
        { lat: stopLat, lon: stopLon }
      );

      // 3️⃣ If bus is at student stop (≤30 meters), mark attendance
      if (distance <= 30) {
        // Check if already marked today
        const [existing] = await db
          .promise()
          .query(
            "SELECT * FROM attendance WHERE student_name=? AND bus_number=? AND date=CURDATE()",
            [student.name, busNumber]
          );

        if (existing.length === 0) {
          await db
            .promise()
            .query(
              "INSERT INTO attendance (student_name, bus_number, date, time, location) VALUES (?, ?, CURDATE(), CURTIME(), CONCAT(?, ',', ?))",
              [student.name, busNumber, busLat, busLon]
            );

          markedStudents.push(student.name);
        }
      }
    }

    res.json({ success: true, markedStudents });
  } catch (err) {
    console.error("Auto attendance error:", err);
    res.status(500).json({ success: false, message: "Error marking attendance" });
  }
});

export default router;
