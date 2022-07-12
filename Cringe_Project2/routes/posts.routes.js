const express = require('express');
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');
const CringePost = require('../models/cringepost.model');
const User = require('../models/User.model.js');


// router.get('/post/create', (req, res) => res.render('auth/login'));

router.get('/post/create', isLoggedIn, (req, res) => res.render('create-post.hbs'))

router.post('/post/create', fileUploader.single('postImage'), (req, res) => {
    const title = req.body.title
   
    CringePost.create({ title, imageUrl: req.file.path, userId: req.session.currentUser._id })
      .then(freshCringe => {
        console.log(freshCringe);
        User.findByIdAndUpdate(req.session.currentUser._id, {
          $push: {cringeArray: freshCringe._id}}, {new:true
        })
        .then((response) =>{
console.log(response)
        })
        res.redirect('/profile')
      })
      .catch(error => console.log(`Error while creating a new movie: ${error}`));
  });
   


module.exports = router;
