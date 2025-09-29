import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { parentName, studentName, busNumber, password } = req.body;

  if (!parentName || !studentName || !busNumber || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Step 1: Check if the student exists with the correct bus and password
  const studentCheckQuery = `
    SELECT * FROM students
    WHERE name = ? AND bus_number = ? AND password = ?
    LIMIT 1
  `;

  db.query(studentCheckQuery, [studentName, busNumber, password], (err, studentResults) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (studentResults.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid student credentials' });
    }

    // Step 2: Check if this student already has a parent
    const studentParentCheckQuery = `
      SELECT * FROM parents
      WHERE student_name = ? AND bus_number = ?
      LIMIT 1
    `;

    db.query(studentParentCheckQuery, [studentName, busNumber], (parentCheckErr, parentCheckResults) => {
      if (parentCheckErr) {
        console.error('DB error:', parentCheckErr);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      if (parentCheckResults.length > 0) {
        // Student already has a parent
        return res.status(400).json({
          success: false,
          message: 'This student already has a parent registered'
        });
      }

      // Step 3: Insert new parent
      const insertParentQuery = `
        INSERT INTO parents (parent_name, student_name, bus_number, password)
        VALUES (?, ?, ?, ?)
      `;

      db.query(insertParentQuery, [parentName, studentName, busNumber, password], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Insert parent error:', insertErr);
          return res.status(500).json({ success: false, message: 'Failed to save parent' });
        }

        return res.status(200).json({
          success: true,
          message: 'Parent login successful and saved',
          parent: {
            id: insertResult.insertId,
            parentName,
            studentName,
            busNumber,
            password
          }
        });
      });
    });
  });
});

export default router;
