import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("loggedIn", "true");

        navigate("/dashboard");
      } else {
        await api.post("/auth/signup", { name, email, password });
        alert("Signup successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
  console.log("Signup Error:", err.response?.data);
  setError(err.response?.data?.message || "Signup failed");
}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#272728"
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "40px",
          borderRadius: "16px",
          background: "#2f3031",
          boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center",color:"#fbf5f5" }}>
          {isLogin ? "Login to AlgoMonitor" : "Create Account"}
        </h2>

        {error && (
          <p style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            marginTop: "18px",
            fontSize: "14px",
            textAlign: "center",
            cursor: "pointer",
            color: "#2563eb"
          }}
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #4d4d4e",
  background: "#373636",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  boxSizing: "border-box"
};