const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const contestRoutes = require("./routes/contests");
const bookmarkRoutes = require("./routes/bookmarks");

const app = express();

// ✅ Enable CORS first
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
const dashboardHandles = require("./routes/dashboardHandles");

app.use("/api/dashboardHandles", dashboardHandles);


module.exports = app;