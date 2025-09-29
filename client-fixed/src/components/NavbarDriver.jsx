import { Link } from "react-router-dom";

export default function NavbarDriver() {
  return (
    <nav className="bg-green-900 text-white p-4 flex gap-6">
      <Link to="/" className="hover:text-yellow-400">Home</Link>
      <Link to="/live-tracking" className="hover:text-yellow-400">Live Tracking</Link>
      <Link to="/manual-attendance" className="hover:text-yellow-400">Manual Attendance</Link>
    </nav>
  );
}
