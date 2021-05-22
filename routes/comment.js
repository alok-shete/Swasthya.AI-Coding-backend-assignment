const express = require("express");
const router = express.Router();

// all Controllers
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getBlogById } = require("../controllers/blog");
const { getAllComments, createComment } = require("../controllers/comment");

// Router Parameters
router.param("userId", getUserById);
router.param("blogId", getBlogById);

//add comment route
router.post(
  "/comment/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  createComment
);

// get all comment by blogId
router.get("/comment/:blogId", getAllComments);

module.exports = router;
