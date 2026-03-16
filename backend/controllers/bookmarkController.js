const Bookmark = require("../models/bookmarkModel");
const saveBookmark = async (req, res) => {

  const { userId, contestId, name, platform, url, startTime } = req.body;

  const existing = await Bookmark.findOne({
    userId,
    contestId
  });

  if (existing) {
    return res.json({
      success: true,
      message: "Already bookmarked"
    });
  }

  const bookmark = new Bookmark({
    userId,
    contestId,
    name,
    platform,
    url,
    startTime
  });

  await bookmark.save();

  res.json({ success: true });

};
const getBookmarks = async (req, res) => {

  try {

    const bookmarks = await Bookmark.find({
      userId: req.params.userId
    });

    res.json({
      success: true,
      data: bookmarks
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Error fetching bookmarks"
    });

  }

};
const deleteBookmark = async (req, res) => {

  try {

    await Bookmark.deleteOne({
      userId: req.params.userId,
      contestId: req.params.contestId
    });

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({ success: false });

  }

};

module.exports = {
  saveBookmark,
  getBookmarks,
  deleteBookmark
};