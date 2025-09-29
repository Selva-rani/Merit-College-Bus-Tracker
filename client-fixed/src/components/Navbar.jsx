// components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    // Check saved role from login (localStorage/sessionStorage)
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken"); // optional if you store token
    navigate("/login");
  };

  // Role-based menu items
  const menuItems = {
    student: [
      { name: "Home", path: "/" },
      { name: "My Bus Location", path: "/bus-tracking" },
      { name: "Profile", path: "/student-profile" },
    ],
    parent: [
      { name: "Home", path: "/" },
      { name: "Track My Child", path: "/bus-tracking" },
      { name: "Profile", path: "/parent-profile" },
    ],
    driver: [
      { name: "Home", path: "/" },
      { name: "Student List", path: "/student-list" },
      { name: "Report Issue", path: "/maintenance" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin-dashboard" },
      { name: "Manage Users", path: "/manage-users" },
      { name: "Reports", path: "/reports" },
      { name: "Routes", path: "/routes" },
    ],
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="text-white text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            College Bus Tracking
          </div>

          {/* Menu Links */}
          <div className="flex items-center gap-6">
            {menuItems[role]?.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white hover:text-yellow-300 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {/* Logout */}
            {role && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
