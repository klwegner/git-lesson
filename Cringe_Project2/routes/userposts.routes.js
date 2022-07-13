const router = require("express").Router();
const User = require("../models/User.model.js");
const { route } = require("./posts.routes.js");


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

//below: edit a post
// router.get('', (req, res) => {
//   const postId = req.params.id;

//   something here (api?)
//     .getOneSomething(postId)
//     .then((res) => {
//       res.render('edit-post', { something: response.data });
//     })
//     .catch(error => console.log(error));
// });




//below: fill out delete post form--goes to /post/id/delete
// router.get('', (req, res) => {
// const postId = req.params.id;

// something here
// .delete blah blah(postId);
// ,then((response => {
//   res.redirect('/profile')
// })
// .catch(error => console.log(error))
// })

module.exports = router;