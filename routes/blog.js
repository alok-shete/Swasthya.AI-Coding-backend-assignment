const express = require("express");
const router = express.Router();

// all Controllers
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  createBlog,
  getOwnBlog,
  getAllBlog,
  getBlog,
  getBlogById,
  deleteBlog,
  updateBlog,
} = require("../controllers/blog");

// Router Parameters
router.param("userId", getUserById);
router.param("blogId", getBlogById);

// add post route
router.post("/blog/:userId", isSignedIn, isAuthenticated, createBlog);

//delete post route
router.delete("/blog/:userId/:blogId", isSignedIn, isAuthenticated, deleteBlog);

//update post route
router.put("/blog/:userId/:blogId", isSignedIn, isAuthenticated, updateBlog);

// get login user all blogs
router.get("/blog/user/:userId", isSignedIn, isAuthenticated, getOwnBlog);

//get blog by id
router.get("/blog/:blogId", getBlog);

//get all blogs
router.get("/blog", getAllBlog);

module.exports = router;
