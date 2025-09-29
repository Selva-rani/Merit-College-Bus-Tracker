import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * POST /api/admin/login
 * Admin login
 * body: { username, password }
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  const query = `SELECT * FROM admins WHERE username = ? AND password = ? LIMIT 1`;
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const admin = results[0];
    // Assume 'managed_buses' is stored as comma-separated string in DB
    const managedBusNumbers = admin.managed_buses.split(",");

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id,
        username: admin.username,
        managedBusNumbers,
      },
    });
  });
});

/**
 * GET /api/admin/students
 * Query: ?busNumbers=BUS101,BUS102
 * Returns students only for the admin's buses
 */
router.get("/students", (req, res) => {
  const { busNumbers } = req.query; // e.g., "BUS101,BUS102"
  if (!busNumbers) return res.status(400).json({ message: "Bus numbers required" });

  const busesArray = busNumbers.split(",");
  const query = `SELECT * FROM students WHERE bus_number IN (?)`;
  db.query(query, [busesArray], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
});

/**
 * GET /api/admin/buses
 * Returns buses assigned to admin
 */
router.get("/buses", (req, res) => {
  const { busNumbers } = req.query;
  if (!busNumbers) return res.status(400).json({ message: "Bus numbers required" });

  const busesArray = busNumbers.split(",");
  const query = `SELECT * FROM buses WHERE bus_number IN (?)`;
  db.query(query, [busesArray], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
});

export default router;
