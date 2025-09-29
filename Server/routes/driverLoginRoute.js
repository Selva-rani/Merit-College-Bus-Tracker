import express from "express";
const router = express.Router();

// Predefined buses
const buses = [
  { bus_number: "BUS101", password: "busone123", route_name: "Sambankulam", driver_name: "Ilayaraja" },
  { bus_number: "BUS102", password: "bustwo456", route_name: "Pavoorchatram", driver_name: "Peter" },
  { bus_number: "BUS103", password: "busthree789", route_name: "Route C", driver_name: "Driver C" },
  { bus_number: "BUS104", password: "busfour000", route_name: "Singampatti", driver_name: "Arun" },
  { bus_number: "BUS105", password: "busfive888", route_name: "Kallidaikurichi", driver_name: "Ganesan" },
  { bus_number: "BUS106", password: "bussix111", route_name: "V.K.Puram", driver_name: "Selva Kumar" },
  { bus_number: "BUS107", password: "busseven999", route_name: "Chettimedu", driver_name: "Sankara Narayanan" },
];

// POST /driver-login
router.post("/driver-login", (req, res) => {
  const { busNumber, password } = req.body;
  const driver = buses.find(
    b => b.bus_number === busNumber && b.password === password
  );
  if (!driver) return res.status(401).json({ message: "Invalid bus number or password" });
  return res.status(200).json({ message: "Login successful", driver });
});

export default router;
