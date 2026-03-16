const express = require("express");
const router = express.Router();

const {
  getUpcomingContests,
  getPastContests
} = require("../controllers/contestController");

router.get("/upcoming", getUpcomingContests);
router.get("/past", getPastContests);

module.exports = router;