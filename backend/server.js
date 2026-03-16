const mongoose = require("mongoose");
const app = require("./app");
const dashboardRoutes = require("./routes/dashboard");
const bookmarkRoutes = require("./routes/bookmarks"); 





mongoose
  .connect("mongodb://127.0.0.1:27017/algomonitor")
  .then(() => console.log("MongoDB Connected"));

app.use("/api", dashboardRoutes);
app.use("/api/bookmarks", bookmarkRoutes); 

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

