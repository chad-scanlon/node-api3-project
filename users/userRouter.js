const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb");
const { getUserPosts } = require("./userDb.js");
const router = express.Router();

router.post("/", (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

router.post("/:id/posts", validateUser, validatePost, (req, res, next) => {
  // do your magic!
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then((post) => {
      res.status(210).json(post);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error getting the messages for the hub",
      });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  console.log(req.query);
  Users.get(req.query)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the user",
      });
    });
});

router.get("/:id", (req, res) => {
  // do your magic!
  console.log(req.query);
  Users.getById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the user",
      });
    });
});

router.get("/:id/posts", validateUser, (req, res) => {
  // do your magic!
  console.log(req.query);
  Users.getUserPosts(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

router.delete("/:id", (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The user has been nuked" });
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

router.put("/:id", (req, res) => {
  // do your magic!
  const changes = req.body;
  Users.update(req.params.id, changes)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error updating the user",
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then((user) => {
      if (user) {
        req.user = user;
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

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body;
  !user || user === {}
    ? res.status(400).json({ message: "missing user data" })
    : next();
}

function validatePost(req, res, next) {
  // do your magic!
  const post = req.body;
  !post || post === {}
    ? res.status(400).json({ message: "missing post data" })
    : next();
}

module.exports = router;
