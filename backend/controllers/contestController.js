const axios = require("axios");

const fetchCodeforces = async () => {
  const res = await axios.get(
    "https://codeforces.com/api/contest.list",
    { timeout: 5000 }
  );

  return res.data.result.map(c => ({
    platform: "Codeforces",
    title: c.name,
    startTime: new Date(c.startTimeSeconds * 1000),
    phase: c.phase,
    url: `https://codeforces.com/contest/${c.id}`
  }));
};
const fetchLeetcode = async () => {
  const res = await axios.post(
    "https://leetcode.com/graphql",
    {
      query: `
        query {
          allContests {
            title
            startTime
            duration
          }
        }
      `
    },
    {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    }
  );

  const now = Date.now();

  return res.data.data.allContests.map(c => ({
    platform: "LeetCode",
    title: c.title,
    startTime: new Date(c.startTime * 1000),
    phase: c.startTime * 1000 > now ? "BEFORE" : "FINISHED",
    url: "https://leetcode.com/contest/"
  }));
};
const fetchCodechef = async () => {
  const res = await axios.get(
    "https://www.codechef.com/api/list/contests/all",
    { timeout: 5000 }
  );

  const future = res.data.future_contests.map(c => ({
    platform: "CodeChef",
    title: c.contest_name,
    startTime: new Date(c.contest_start_date_iso),
    phase: "BEFORE",
    url: `https://www.codechef.com/${c.contest_code}`
  }));

  const past = res.data.past_contests.map(c => ({
    platform: "CodeChef",
    title: c.contest_name,
    startTime: new Date(c.contest_start_date_iso),
    phase: "FINISHED",
    url: `https://www.codechef.com/${c.contest_code}`
  }));

  return [...future, ...past];
};

const getUpcomingContests = async (req, res) => {
  try {

    const [cf, cc, lc] = await Promise.all([
      fetchCodeforces(),
      fetchCodechef(),
      fetchLeetcode()
    ]);

    const contests = [...cf, ...cc, ...lc]
      .filter(c => c.phase === "BEFORE")
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 20);

    res.json({
      success: true,
      data: contests
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching contests"
    });
  }
};

const getPastContests = async (req, res) => {
  try {

    const [cf, cc, lc] = await Promise.all([
      fetchCodeforces(),
      fetchCodechef(),
      fetchLeetcode()
    ]);

    const contests = [...cf, ...cc, ...lc]
      .filter(c => c.phase === "FINISHED")
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, 20);

    res.json({
      success: true,
      data: contests
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching contests"
    });
  }
};

module.exports = {
  getUpcomingContests,
  getPastContests
};