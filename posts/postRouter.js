const express = require("express");
const Posts = require("./postDb.js");
const router = express.Router();

router.get("/", (req, res) => {
  // do your magic!
  console.log(req.query);
  Posts.get(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  console.log(req.query);
  Posts.getById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "post not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been nuked" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  // do your magic!
  const changes = req.body;
  Posts.update(req.params.id, changes)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error updating the post",
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Posts.getById(id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        // res.status(404).json({ message: 'does not exist' });
        next(new Error("does not exist"));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "invalid user id", err });
    });
}

module.exports = router;
