import express from "express";
import db from "../db.js";

const router = express.Router();

// POST /api/students/login
router.post("/login", (req, res) => {
  const { studentName, department, year, busNumber, password } = req.body;

  if (!studentName || !department || !year || !busNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log("[LOGIN ATTEMPT]", { studentName, department, year, busNumber, password });

  // Step 1: Validate busNumber + password in buses table
  const busCheckQuery = `
    SELECT * FROM buses WHERE bus_number = ? AND password = ? LIMIT 1
  `;

  db.query(busCheckQuery, [busNumber, password], (busErr, busResults) => {
    if (busErr) {
      console.error("[BUS CHECK ERROR]", busErr);
      return res.status(500).json({ message: "Server error during bus validation" });
    }

    console.log("[BUS CHECK RESULT]", busResults);

    if (busResults.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid bus number or password" });
    }

    // Step 2: Insert student into DB (if not already exists)
    const insertStudentQuery = `
      INSERT IGNORE INTO students (name, department, year, bus_number, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertStudentQuery,
      [studentName, department, year, busNumber, password],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("[INSERT STUDENT ERROR]", insertErr);
          return res.status(500).json({ message: "Failed to register student" });
        }

        console.log("[STUDENT INSERTED]", { studentName, department, year, busNumber });

        res.status(200).json({
          success: true,
          message: "Login successful",
          student: {
            name: studentName,
            department,
            year,
            bus_number: busNumber,
          }
        });
      }
    );
  });
});

export default router;
