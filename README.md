## Problem Statement

1. There are Users and Blogs, and any user can comment on any blog.
2. Create a database with sample data, use the database of your choice.
3. Consider all users who have commented on the same blog as friends (1st level friend).
4. A friend is 2nd level friend if he has commented on a blog where a 1st level friend has also commented but has not commented on any common blog.
5. Example - Blog1 has the comment of {User1, User2}, Blog2 has the comment of {User1, User3} here User2 and User3 are 2nd level friend if there exists no blog which has the comment of User2 and User3.
6. Similar to above there can be third level friend and k-th level friend ( LinkedIn shows this kind of friend level)
7. Create a REST api GET /users/&lt;userId&gt;/level/&lt;levelNo&gt; which should give list of all friends of that level for given userId (ex-/users/1234/level/1 for first level friend)
8. Use high standard design principles while implementing the solution
9. Write modular and clean code with comments keeping in mind scalability and manageability of code.

## Technical stack

1.  NodeJS
2.  Express
3.  Mongodb/Mongoose

## Find User Friend's by Level (Approach)

1. First Get User All Commented blog ObjectId
2. Using this blog ObjectId, Get List of Friend with level
3. Then Filter This all Friend by Level
4. Send All Filter data as a response

```
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
```
