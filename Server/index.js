// index.js (correct order: create server & io BEFORE using routes that need io)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import db from "./db.js";

// Import routes (manualAttendanceRoute is a function that accepts io)
import studentLoginRoute from "./routes/studentLoginRoute.js";
import parentLoginRoute from "./routes/parentLoginRoute.js";
import driverLoginRoute from "./routes/driverLoginRoute.js";
import adminLoginRoute from "./routes/adminLoginRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import manualAttendanceRoute from "./routes/manualAttendanceRoute.js"; // exports default function(io)
import adminRoutes from "./routes/adminRoutes.js";
import adminStudentsRoute from "./routes/adminStudentsRoute.js";
import studentLocationRoute from "./routes/studentLocationRoute.js";
import autoAttendanceRoute from "./routes/autoAttendanceRoute.js";
import adminAttendanceRoute from "./routes/adminAttendanceRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// create HTTP server and Socket.io BEFORE mounting routes that need io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// make io available via app if needed
app.set("io", io);

// Test DB connection
db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL database");
});

// ------------------- REST Routes ------------------- //
// routes that DO NOT require io
app.use("/api/students", studentLoginRoute);
app.use("/api/parents", parentLoginRoute);
app.use("/api/driver", driverLoginRoute);
app.use("/api/admin-login", adminLoginRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-students", adminStudentsRoute);
app.use("/api/students/location", studentLocationRoute);
app.use("/api/attendance/auto", autoAttendanceRoute);
app.use("/api/admin-attendance", adminAttendanceRoute);

// mount manualAttendanceRoute with io (it must receive the live io instance)
app.use("/api/manual-attendance", manualAttendanceRoute(io));

// ------------------- Socket.io Setup ------------------- //
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join_bus", ({ busNumber, role, studentName }) => {
    if (!busNumber) return;
    socket.join(`bus_${busNumber}`);
    if (role === "student" && studentName) socket.join(`student_${studentName}`);
  });

  socket.on("driver-location", ({ bus_number, latitude, longitude }) => {
    if (!bus_number || latitude === undefined || longitude === undefined) return;
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    db.query(
      `INSERT INTO live_locations (bus_number, latitude, longitude, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE latitude=?, longitude=?, updated_at=NOW()`,
      [bus_number, lat, lon, lat, lon],
      (err) => {
        if (err) {
          console.error("DB error saving live_locations:", err);
          socket.emit("location_ack", { ok: false, message: "DB error" });
          return;
        }
        io.to(`bus_${bus_number}`).emit("bus_location", { bus_number, latitude: lat, longitude: lon });
        socket.emit("location_ack", { ok: true, message: "Location saved & broadcasted" });
      }
    );
  });

  socket.on("student-boarded", ({ studentName, busNumber, latitude, longitude }) => {
    if (!studentName || !busNumber) return;
    const today = new Date().toISOString().split("T")[0];

    db.query(
      "SELECT * FROM attendance WHERE student_name = ? AND bus_number = ? AND date = ?",
      [studentName, busNumber, today],
      (err, rows) => {
        if (err) return console.error("DB error checking attendance:", err);
        if (rows.length > 0) {
          io.to(`student_${studentName}`).emit("attendance_marked", { studentName, bus_number: busNumber, already: true });
          return;
        }

        db.query(
          "INSERT INTO attendance (student_name, bus_number, date, time, location, type) VALUES (?, ?, CURDATE(), CURTIME(), ?, 'automatic')",
          [studentName, busNumber, `${latitude},${longitude}`],
          (err) => {
            if (err) return console.error("DB error inserting attendance:", err);
            io.to(`student_${studentName}`).emit("attendance_marked", { studentName, bus_number: busNumber, already: false });
            io.to("admin_room").emit("attendance_marked_admin", {
              studentName,
              bus_number: busNumber,
              time: new Date().toISOString(),
              type: "automatic"
            });
          }
        );
      }
    );
  });

  socket.on("manual-attendance", ({ studentName, busNumber, department, year }) => {
    if (!studentName || !busNumber) return;
    db.query(
      "INSERT INTO attendance (student_name, bus_number, department, year, date, time, type) VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), 'manual')",
      [studentName, busNumber, department, year],
      (err) => {
        if (err) return console.error("DB error inserting manual attendance:", err);
        io.to(`bus_${busNumber}`).emit("manual_attendance_marked", { studentName, busNumber, type: "manual" });
        io.to("admin_room").emit("attendance_marked_admin", {
          studentName,
          bus_number: busNumber,
          time: new Date().toISOString(),
          type: "manual"
        });
      }
    );
  });

  socket.on("disconnect", () => console.log("❌ Socket disconnected:", socket.id));
});

// ------------------- Start Server ------------------- //
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
