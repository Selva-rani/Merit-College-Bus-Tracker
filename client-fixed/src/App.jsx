import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import ParentsLogin from "./pages/ParentsLogin";
import DriverLogin from "./pages/DriverLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";   
import About from "./pages/About";  
import Help from "./pages/Help";
import AdminStudents from "./pages/AdminStudents";
import AdminBuses from "./pages/AdminBuses";
import AdminAttendance from "./pages/AdminAttendance";
import DriverLiveLocation from "./pages/DriverLiveLocation";
import ManualAttendance from "./pages/ManualAttendance";
import ParentDashboard from "./pages/ParentDashboard";
import GeneralInfo from "./pages/GeneralInfo";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/parents-login" element={<ParentsLogin />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver-login" element={<DriverLogin />} />
        {/* Corrected: add /live-tracking */}
        <Route path="/live-tracking" element={<DriverLiveLocation />} />
        <Route path="/driver-live-location" element={<DriverLiveLocation />} />
        <Route path="/manual-attendance" element={<ManualAttendance />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-students" element={<AdminStudents />} />
        <Route path="/admin-buses" element={<AdminBuses />} />
        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/general-info" element={<GeneralInfo />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
