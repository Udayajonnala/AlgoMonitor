import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.name) {
      setUserName(savedUser.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");

    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <div className="logo">AlgoMonitor</div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/contests">Contests</Link>
        <Link to="/bookmarks">Bookmarks</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="nav-right">
        <span className="user-name">Hi, {userName}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}