const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    userId: String,
  contestId: String,
  name: String,
  platform: String,
  url: String,
  startTime: String
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
