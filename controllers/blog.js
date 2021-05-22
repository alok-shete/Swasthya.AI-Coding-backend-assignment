const Blog = require("../models/blog");

// get Blog by id
exports.getBlogById = (req, res, next, id) => {
  Blog.findById(id).exec((err, blog) => {
    if (err || !blog) {
      return res.status(400).json({
        error: "Blog not found",
      });
    }
    req.blog = blog;
    next();
  });
};

// get Blog content
exports.getBlog = (req, res) => {
  return res.json(req.blog);
};

// create blog
exports.createBlog = (req, res) => {
  req.body.user = req.profile._id;
  const blog = new Blog(req.body);
  blog.save((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to Create Blog ",
      });
    }
    res.json({ blog });
  });
};

// get all own blogs(using user_id/sign user)
exports.getOwnBlog = (req, res) => {
  Blog.find({ user: req.profile._id }).exec((err, blogs) => {
    if (err || !blogs) {
      return res.status(400).json({
        error: "NO Blog found",
      });
    }
    res.json(blogs);
  });
};

//get All Blog
exports.getAllBlog = (req, res) => {
  Blog.find().exec((err, blogs) => {
    if (err || !blogs) {
      return res.status(400).json({
        error: "NO Blog found",
      });
    }
    res.json(blogs);
  });
};

// deleteBlog By Owner Of blog
exports.deleteBlog = (req, res) => {
  let blog = req.blog;
  if (req.blog.user !== req.profile._id) {
    return res.status(400).json({
      error: "ACCESS DENIED",
    });
  }
  blog.remove((err, deletedblog) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the Blog",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedblog,
    });
  });
};

// update blog by owner
exports.updateBlog = (req, res) => {
  Blog.findByIdAndUpdate(
    { _id: req.blog._id, user: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, blog) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this blog",
        });
      }
      res.json(blog);
    }
  );
};
