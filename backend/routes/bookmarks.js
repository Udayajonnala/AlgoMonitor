const express = require("express");
const router = express.Router();

const { saveBookmark, getBookmarks, deleteBookmark } = require("../controllers/bookmarkController");

router.post("/", saveBookmark);                    
router.get("/:userId", getBookmarks);               
router.delete("/:userId/:contestId", deleteBookmark); 
module.exports = router;