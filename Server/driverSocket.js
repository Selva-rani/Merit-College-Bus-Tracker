// driverSocket.js
import db from "./db.js";

export default function driverSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // Join a bus room (students + parents share same bus room)
    socket.on("join_bus", ({ busNumber, role, name }) => {
      if (!busNumber) return;
      socket.join(`bus_${busNumber}`);
      console.log(`Socket ${socket.id} joined bus_${busNumber} as ${role || "visitor"}`);

      // If student joins → also join their personal channel
      if (role === "student" && name) {
        socket.join(`student_${name}`);
        console.log(`Socket ${socket.id} joined student_${name}`);
      }

      // If parent joins → log for clarity
      if (role === "parent" && name) {
        console.log(`👨‍👩‍👧 Parent ${name} joined tracking for bus ${busNumber}`);
      }
    });

    // Driver sends live location
    socket.on("driver-location", ({ bus_number, latitude, longitude }) => {
      if (!bus_number || latitude === undefined || longitude === undefined) return;
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      // Save into DB
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

          // Broadcast location to all clients (students + parents) in that bus room
          io.to(`bus_${bus_number}`).emit("bus_location", {
            bus_number,
            latitude: lat,
            longitude: lon,
            updatedAt: new Date().toISOString(),
          });

          socket.emit("location_ack", { ok: true, message: "Location saved & broadcasted" });
        }
      );
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}
