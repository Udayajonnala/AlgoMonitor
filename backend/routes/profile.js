const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/handles", async (req, res) => {

  try {

    const { email, leetcode, codeforces, codechef } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      {
        handles: {
          leetcode,
          codeforces,
          codechef
        }
      },
      { new: true }
    );

    res.json(user.handles);

  } catch (err) {

    res.status(500).json({ error: "Server error" });

  }

});
router.get("/handles/:userid", async (req, res) => {

  try {

    const user = await User.findById(req.params.userid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.handles || {});

  } catch (err) {

    res.status(500).json({ error: "Server error" });

  }

});
module.exports = router;