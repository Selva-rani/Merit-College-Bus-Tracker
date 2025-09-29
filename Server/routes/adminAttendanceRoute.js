// routes/adminAttendanceRoute.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const date = req.query.date || new Date().toISOString().split("T")[0];

  db.query(
    `SELECT student_name, bus_number, department, year, time, location, type 
     FROM attendance WHERE date=? ORDER BY bus_number, time`,
    [date],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      res.json(results);
    }
  );
});

export default router;
