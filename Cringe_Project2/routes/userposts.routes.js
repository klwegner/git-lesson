const router = require("express").Router();
const Posts = require("../models/cringepost.model.js");


//how to make it where users have an ID and pics from that ID are what gets posted here only?
router.get("/profile", (req, res) => {
  Posts.find()
    .then((myPosts) => {
      console.log(myPosts);
      res.render("profile", {myPosts});
    })
    .catch((err) => res.send(err));
});

module.exports = router;