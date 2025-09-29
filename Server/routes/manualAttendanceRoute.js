// routes/manualAttendanceRoute.js
import express from "express";
import db from "../db.js";

export default function (io) {
  const router = express.Router();

  // ------------------- Get students assigned to a bus ------------------- //
  router.get("/students/:bus_number", (req, res) => {
    const busNumber = req.params.bus_number;

    const query = `
      SELECT id, name, department, year, bus_number
      FROM students
      WHERE bus_number = ?
      ORDER BY name
    `;
    db.query(query, [busNumber], (err, results) => {
      if (err) {
        console.error("DB error fetching students:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json(results);
    });
  });

  // ------------------- Mark manual attendance ------------------- //
  router.post("/mark", (req, res) => {
    const { student_name, bus_number, department, year } = req.body;

    if (!student_name || !bus_number) {
      return res.status(400).json({ success: false, message: "Missing required data" });
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if attendance already exists for today
    const checkQuery = `
      SELECT * FROM attendance
      WHERE student_name = ? AND bus_number = ? AND date = ?
    `;
    db.query(checkQuery, [student_name, bus_number, today], (err, rows) => {
      if (err) {
        console.error("DB error checking attendance:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (rows.length > 0) {
        return res.json({ success: false, message: "Attendance already marked today" });
      }

      // Insert new attendance
      const insertQuery = `
        INSERT INTO attendance (student_name, bus_number, department, year, date, time, type)
        VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), 'manual')
      `;
      db.query(insertQuery, [student_name, bus_number, department, year], (err) => {
        if (err) {
          console.error("DB error inserting attendance:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }

        const timeNow = new Date().toTimeString().split(" ")[0];

        // Emit event to admin dashboards
        io.emit("attendance-updated", {
          student_name,
          bus_number,
          department,
          year,
          date: today,
          time: timeNow,
          type: "manual",
        });

        res.json({ success: true, message: "Attendance marked" });
      });
    });
  });

  return router;
}
