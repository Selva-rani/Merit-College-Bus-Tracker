import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function DriverLiveLocation() {
  const [busNumber, setBusNumber] = useState("");
  const [status, setStatus] = useState("⏳ Waiting...");
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to backend Socket.io
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    const storedBus = localStorage.getItem("busNumber");
    if (!storedBus) {
      setStatus("❌ No bus number. Login first.");
      return;
    }
    setBusNumber(storedBus);

    // High accuracy GPS
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });

        // Emit to backend
        newSocket.emit("driver-location", {
          bus_number: storedBus,
          latitude,
          longitude,
        });

        setStatus("✅ Sharing live location...");
      },
      (err) => {
        console.error("GPS error:", err);
        setStatus(
          err.code === 1
            ? "❌ GPS access denied. Allow location."
            : "❌ Unable to get location."
        );
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-2">🚍 Driver Live Location</h2>
      <p className="text-gray-600 mb-2">{status}</p>
      <p className="text-gray-500 mb-3">Bus Number: {busNumber}</p>

      {location.lat && location.lon ? (
        <iframe
          title="Driver Map"
          width="100%"
          height="300"
          src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
          className="rounded-lg"
        />
      ) : (
        <p className="text-gray-400">Location not available yet...</p>
      )}
    </div>
  );
}
