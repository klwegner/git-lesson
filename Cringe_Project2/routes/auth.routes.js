

const { Router } = require("express");
const router = new Router();
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
let cringeLevel = ' &#128118; Cringe Kid &#128556;'
        let numOfPosts = myUser.cringeArray.length;
        if (numOfPosts > 4 && numOfPosts < 10) {
            cringeLevel = '&#128124; Kinda Cringe &#128556;'
        }
        if (numOfPosts > 10 && numOfPosts < 20) {
          cringeLevel ='&#128130; Captain Cringe &#128556;'
        }
        if (numOfPosts > 20 && numOfPosts < 30) {
          cringeLevel = '&#127863; Cringe Conisseur &#128556;'
        }
        else {
            cringeLevel = '&#128081; King of Cringe &#128556;'
        }

      res.render('users/user-profile', { userInSession: myUser, cringeLevel });
    })
    .catch((err) => res.send(err));
})












router.get('/profile/edit', isLoggedIn, (req, res) => {
res.render('edit-profile.hbs', {userInSession: req.session.currentUser})
})

router.post('/profile/edit', isLoggedIn, (req, res) => {
User.findByIdAndUpdate(req.session.currentUser._id, {about: req.body.about}, {new: true})
.then((updatedUser) =>{
  req.session.currentUser = updatedUser;
  res.redirect('/profile')
})
.catch(error => console.log(`Error while updating profile: ${error}`));
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

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});


module.exports = router;



