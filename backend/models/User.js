const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  handles: {
    leetcode: { type: String, default: "" },
    codeforces: { type: String, default: "" },
    codechef: { type: String, default: "" }
  },

  liveStats: {
    leetcode: {
      stats: [
        {
          difficulty: String,
          count: Number
        }
      ],
      ranking: { type: Number, default: 0 },
      reputation: { type: Number, default: 0 }
    },
    codeforces: {
      totalSolved: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      rank: { type: String, default: "unranked" },
      topics: [
        {
          topic: String,
          count: Number
        }
      ]
    },
    codechef: {
      rating: { type: Number, default: 0 },
      globalRank: { type: Number, default: 0 },
      solved: { type: Number, default: 0 },
      stars: { type: String, default: "0★" }
    },
    totalSolved: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: null }
  }
});

module.exports = mongoose.model("User", userSchema);