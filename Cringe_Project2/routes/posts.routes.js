const express = require('express');
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');
const CringePost = require('../models/cringepost.model')

//isLoggedOut for first route and isLoggedIn for second route not working

// router.get('/post/create', (req, res) => res.render('auth/login'));

router.get('/post/create', isLoggedIn, (req, res) => res.render('create-post.hbs'))

router.post('/post/create', fileUploader.single('postImage'), (req, res) => {
    const title = req.body.title
   
    CringePost.create({ title, imageUrl: req.file.path })
      .then(freshCringe => {
        console.log(freshCringe);
        res.redirect('/profile')
      })
      .catch(error => console.log(`Error while creating a new movie: ${error}`));
  });
   


module.exports = router;
