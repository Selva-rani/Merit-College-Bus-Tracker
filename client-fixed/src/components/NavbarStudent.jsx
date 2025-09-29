import { Link } from "react-router-dom";

export default function NavbarStudent() {
  return (
    <nav className="bg-indigo-900 text-white p-4 flex gap-6">
      <Link to="/" className="hover:text-yellow-400">Home</Link>
      <Link to="/general-info">General Info</Link>
    </nav>
  );
}
