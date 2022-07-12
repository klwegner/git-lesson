const router = require("express").Router();
const Posts = require("../models/cringepost.model.js");

router.get("/", (req, res) => {
  Posts.find()
    .then((allPosts) => {
      console.log(allPosts);
      res.render("index", {allPosts});
    })
    .catch((err) => res.send(err));
});

module.exports = router;
