import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// ✅ Connect socket
const socket = io("http://localhost:5000");

export default function ParentDashboard() {
  const [busNumber, setBusNumber] = useState("");
  const [place, setPlace] = useState("Waiting for location...");
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const storedBus = localStorage.getItem("busNumber");
    if (storedBus) {
      setBusNumber(storedBus);
      socket.emit("join_bus", { busNumber: storedBus, role: "parent" });
      console.log("👨‍👩‍👧 Parent joined bus:", storedBus);
    }

    const handleBusLocation = async (data) => {
      if (!data || !data.latitude || !data.longitude) return;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${data.latitude}&lon=${data.longitude}&format=json`
        );
        const geoData = await res.json();

        // ✅ Choose only the concise place: town, village, or city
        const locationName =
          geoData.address?.town ||
          geoData.address?.village ||
          geoData.address?.city ||
          "Unknown Location";

        setPlace(locationName);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Geocoding error:", err);
        setPlace(`${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}`);
      }
    };

    socket.on("bus_location", handleBusLocation);

    return () => {
      socket.off("bus_location", handleBusLocation);
    };
  }, []);

  // Refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (busNumber) {
        console.log("⏳ Refreshing bus location...");
        socket.emit("join_bus", { busNumber, role: "parent" });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [busNumber]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Parent Dashboard</h2>
      <p className="mb-2">
        Bus Number: <span className="font-semibold">{busNumber || "Unknown"}</span>
      </p>
      <p className="text-lg mb-2">
        🚌 Current Bus Location:{" "}
        <span className="font-semibold text-blue-600">{place}</span>
      </p>
      {lastUpdate && (
        <p className="text-gray-500 text-sm">Last updated: {lastUpdate}</p>
      )}
      <p className="text-gray-400 text-sm mt-2">
        Location updates every minute automatically.
      </p>
    </div>
  );
}
