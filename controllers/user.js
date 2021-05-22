var mongoose = require("mongoose");
const User = require("../models/user");
const Comment = require("../models/comment");

// User Info By Id(middleware)
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

//get level number form param
exports.getLevelNo = (req, res, next, id) => {
  req.level = id;
  next();
};

// get user Info
exports.getUser = (req, res) => {
  // remove salt and password
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

// Update user Info
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      // remove salt and password
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

// get friend list using level and userId
exports.getFriendByLevel = (req, res) => {
  // find user commented blog
  Comment.find({ user: req.profile._id }, "blog").exec((err, comments) => {
    if (err) {
      return res.status(400).json({
        error: "Friend Not found",
      });
    }
    // using blog ObjectId get comment count of common friend
    User.aggregate([
      {
        $lookup: {
          from: "comments",
          as: "level",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$userId", "$user"] },
                blog: {
                  //Search comment by blog id
                  $in: comments.map((comment) =>
                    mongoose.Types.ObjectId(comment.blog)
                  ),
                },
              },
            },
          ],
        },
      },
      { $addFields: { level: { $size: "$level" } } },
    ]).exec((err, response) => {
      if (err) {
        return res.status(400).json({
          error: "Friend Not found",
        });
      }
      let friends = [];
      // filter data by level
      response.map((result) => {
        if (
          parseInt(result.level) === parseInt(req.level) &&
          result._id.toString() !== req.profile._id.toString()
        ) {
          // remove unwanted info
          result.salt =
            result.encry_password =
            result.createdAt =
            result.updatedAt =
            result.__v =
            result.level =
              undefined;
          friends.push(result);
        }
      });
      res.json(friends);
    });
  });
};
