import express from "express";
import db from "../db.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  const correctPassword = "merit1809";

  if (password !== correctPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }

  // Check how many unique usernames already exist
  const countQuery = `SELECT COUNT(*) AS userCount FROM admins`;

  db.query(countQuery, (countErr, countResult) => {
    if (countErr) {
      console.error("Database error:", countErr);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }

    const userCount = countResult[0].userCount;

    if (userCount >= 10) {
      return res.status(403).json({
        success: false,
        message: "Maximum of 10 unique admin users allowed",
      });
    }

    // Insert username into admins table if not already exists
    const insertQuery = `INSERT INTO admins (username) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = ?)`;

    db.query(insertQuery, [username, username], (insertErr) => {
      if (insertErr) {
        console.error("DB Insert Error:", insertErr);
        return res
          .status(500)
          .json({ success: false, message: "Failed to record admin login" });
      }

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        admin: { username },
      });
    });
  });
});

export default router;
