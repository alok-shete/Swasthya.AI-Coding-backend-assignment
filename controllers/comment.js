const Comment = require("../models/comment");

// add comment on blog
exports.createComment = (req, res) => {
  req.body.user = req.profile._id;
  req.body.blog = req.blog._id;
  const comment = new Comment(req.body);
  comment.save((err, response) => {
    if (err || !response) {
      return res.status(400).json({
        error: "NOT able to Add Comment",
      });
    }
    res.json({ response });
  });
};

// get all comment by blog id
exports.getAllComments = (req, res) => {
  Comment.find({ blog: req.blog._id }).exec((err, response) => {
    if (err || !response) {
      return res.status(400).json({
        error: "NO comment found",
      });
    }
    res.json(response);
  });
};
