import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// ✅ Proper Leaflet marker icon imports for Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix Leaflet default icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Tracker = () => {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("studentName");
  const busNumber = localStorage.getItem("busNumber");

  const [busLocation, setBusLocation] = useState({
    lat: 10.7905, // default starting point
    lng: 78.7047,
    name: "Starting Point",
    timestamp: new Date().toLocaleTimeString(),
  });

  // 🔒 Redirect if student not logged in
  useEffect(() => {
    if (!studentName || !busNumber) {
      navigate("/");
    }
  }, [navigate, studentName, busNumber]);

  // 🛰️ Fetch driver location every 5 seconds from backend
  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/driver-location/get-location/${busNumber}`
        );
        const data = res.data;
        if (data) {
          setBusLocation({
            lat: data.lat,
            lng: data.lng,
            name: data.name || "Bus Current Location",
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
          });
        }
      } catch (err) {
        console.error("Error fetching bus location:", err);
      }
    };

    fetchBusLocation(); // initial fetch
    const interval = setInterval(fetchBusLocation, 5000); // update every 5s
    return () => clearInterval(interval);
  }, [busNumber]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Bus Tracker</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center mb-6">
        <p className="text-xl mb-2">👋 Welcome <strong>{studentName}</strong></p>
        <p className="text-lg mb-2">🚌 Your Bus: <strong>{busNumber}</strong></p>
        <p className="text-gray-600">📍 Live tracking your bus below</p>
        <p className="text-gray-600 mt-1">Last Updated: {busLocation.timestamp}</p>
      </div>

      <MapContainer
        center={[busLocation.lat, busLocation.lng]}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full max-w-2xl h-96 rounded-2xl shadow-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[busLocation.lat, busLocation.lng]}>
          <Popup>
            🚌 Bus {busNumber} <br /> {busLocation.name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Tracker;
