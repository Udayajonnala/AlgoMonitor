const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:userId", async (req, res) => {
  try {

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        leetcode: user.leetcode,
        codeforces: user.codeforces,
        codechef: user.codechef
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;