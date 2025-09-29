import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all students grouped by bus
router.get("/studentsByBus", (req, res) => {
  const query = "SELECT * FROM students ORDER BY bus_number, id";

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB error fetching students:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const grouped = {};
    results.forEach((student) => {
      if (!grouped[student.bus_number]) grouped[student.bus_number] = [];
      grouped[student.bus_number].push(student);
    });

    res.json(grouped);
  });
});

// Remove a student
router.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("DB error deleting student:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
});

export default router;
