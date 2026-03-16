const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const User = require("../models/User");


async function fetchLeetCodeStats(handle) {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats { acSubmissionNum { difficulty count } }
          profile { ranking  }
        }
      }
    `;
    const resp = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username: handle },
    });

    const acData = resp.data.data.matchedUser.submitStats.acSubmissionNum;
    const profile = resp.data.data.matchedUser.profile;

    return {
      stats: acData.map((d) => ({ difficulty: d.difficulty, count: d.count })),
      ranking: profile.ranking || 0,
     
    };
  } catch (err) {
    console.error("LeetCode fetch error:", err.message);
    return { stats: [], ranking: 0, reputation: 0 };
  }
}


async function fetchCodeforcesStats(handle) {
  try {
    const [cfStatusResp, cfInfoResp] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`)
    ]);

    const submissions = cfStatusResp.data.result;
    const info = cfInfoResp.data.result[0];

    const solvedProblemIds = new Set();
    const topicCount = {}; 

    submissions.forEach((sub) => {
     
      if (sub.verdict === "OK") {
        
        const problemId = `${sub.problem.contestId}${sub.problem.index}`;
        
        if (!solvedProblemIds.has(problemId)) {
          solvedProblemIds.add(problemId);

         
          (sub.problem.tags || []).forEach((tag) => {
            topicCount[tag] = (topicCount[tag] || 0) + 1;
          });
        }
      }
    });

    const topics = Object.entries(topicCount)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count); // Sort by most solved

    return {
      totalSolved: solvedProblemIds.size,
      rating: info.rating || 0,
      maxRating: info.maxRating || 0,
      rank: info.rank || "unranked",
      topics,
    };
  } catch (err) {
    console.error("Codeforces fetch error:", err.message);
    return { totalSolved: 0, rating: 0, maxRating: 0, topics: [] };
  }
}

async function fetchCodeChefStats(handle) {
  try {
    const resp = await axios.get(`https://cp-rating-api.vercel.app/codechef/${handle}`);
    const data = resp.data;

    return {
      rating: data.rating || 0,
      globalRank: data.globalRank || 0,
      stars: data.stars || "0★"
    };

  } catch (err) {
    console.error("CodeChef API error:", err.message);
    return { rating: 0, globalRank: 0, stars: "0★" };
  }
}

router.get("/dashboard-stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { leetcode, codeforces, codechef } = user.handles || {};

    const [lcData, cfData, ccData] = await Promise.all([
      leetcode ? fetchLeetCodeStats(leetcode) : Promise.resolve({ stats: [], ranking: 0, reputation: 0 }),
      codeforces ? fetchCodeforcesStats(codeforces) : Promise.resolve({ totalSolved: 0, rating: 0, maxRating: 0, topics: [] }),
      codechef ? fetchCodeChefStats(codechef) : Promise.resolve({ rating: 0, globalRank: 0, solved: 0 })
    ]);
   const totalSolved =
  (lcData.stats?.find(d => d.difficulty === "All")?.count || 0) +
  (cfData.totalSolved || 0) +
  (ccData.solved || 0);
   
    user.liveStats = {
      leetcode: lcData,
      codeforces: cfData,
      codechef: ccData,
       totalSolved, 
      lastUpdated: new Date()
    };
    await user.save();

    res.json(user.liveStats);
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ message: "Error fetching dashboard data", error: err.message });
  }
});

module.exports = router;