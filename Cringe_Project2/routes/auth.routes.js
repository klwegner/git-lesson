

const { Router } = require("express");
const router = new Router();
// const imgur = require('imgur');
// const fileUpload = require('express-fileupload');
const bcryptjs = require("bcryptjs");
const serveFavicon = require("serve-favicon");
const UserModel = require("../models/User.model");
const saltRounds = 10;
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {

    const { username, email, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
        console.log(`Password hash: ${hashedPassword}`);
        UserModel.create({
            email,
            passwordHash: hashedPassword,
        });
    })
    .then((createdUser) => {
        console.log('newly created user', createdUser);
        res.redirect('/profile')
    })
    .catch((error) => next(error));
});

router.get('/profile', isLoggedIn, (req, res) => {
  User.findById(req.session.currentUser._id)
  .populate('cringeArray')
    .then((myUser) => {
      console.log(myUser);
      res.render('users/user-profile', { userInSession: myUser});
    })
    .catch((err) => res.send(err));
})

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both email and password to login.'
    });
    return;
  }
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      }
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});


router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;



