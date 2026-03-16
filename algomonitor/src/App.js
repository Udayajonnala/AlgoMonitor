import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Contests from "./pages/Contests";
import Bookmarks from "./pages/Bookmarks";

import "./styles.css";



function Layout() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token");

  return (
    <>
      {/* Hide navbar on login */}
      {location.pathname !== "/login" && location.pathname !== "/" && <Navbar />}

      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/contests"
          element={isLoggedIn ? <Contests /> : <Navigate to="/login" />}
        />

        <Route
          path="/bookmarks"
          element={isLoggedIn ? <Bookmarks /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}