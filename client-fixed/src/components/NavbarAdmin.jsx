import { Link } from "react-router-dom";

export default function NavbarAdmin() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex gap-6">
      <Link to="/" className="hover:text-yellow-400">Home</Link>
      <Link to="/admin-login" className="hover:text-yellow-400">Admin Panel</Link>
      <Link to="/bus-tracking" className="hover:text-yellow-400">Live Tracking</Link>
    </nav>
  );
}
