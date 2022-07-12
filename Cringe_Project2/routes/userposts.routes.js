const router = require("express").Router();
const User = require("../models/User.model.js");


//how to make it where users have an ID and pics from that ID are what gets posted here only?
router.get("/profile", (req, res) => {
  User.findById(req.session.currentUser._id)
  .populate('cringeArray')
    .then((myUser) => {
      console.log(myUser);
      res.render("profile", {myUser});
    })
    .catch((err) => res.send(err));
});

module.exports = router;