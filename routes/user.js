const express = require("express");
const router = express.Router();

// all Controllers
const {
  getUserById,
  getUser,
  updateUser,
  getLevelNo,
  getFriendByLevel,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

// Router Parameters
router.param("userId", getUserById);
router.param("levelNo", getLevelNo);

// get signin user info
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//update user info
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// get friend list by userId and level
router.get("/users/:userId/level/:levelNo", getFriendByLevel);

module.exports = router;
