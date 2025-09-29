import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /api/student/:id
router.get("/:id", (req, res) => {
  const studentId = req.params.id;
  const sql = "SELECT id, name, department, year, bus_number, lat, lon FROM students WHERE id = ?";

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(results[0]);
  });
});

export default router;
