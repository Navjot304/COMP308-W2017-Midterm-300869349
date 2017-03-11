/*
Name: Navjot Kaur
Student ID: 300869349
File Name: index.js
Web app name: https://comp308-2017-midterm-300869349.herokuapp.com/
*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport =require('passport');

//define user model
let userModel=require('../models/users');
let User=userModel.User;

// define the book model
let book = require('../models/books');

function requireAuth(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}


/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : '',
    books: ''
   });
});


/* GET /login - render the login view */
router.get('/login', (req, res, next) => {
  // check to see  if the user is not already logged index
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: 'Login',
      books: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/books'); // redirect to the games list
  }
});

// POST /login - process the login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET /register - render the register page
router.get('/register', (req, res, next) =>{
  // check if the user is not already logged in
  if(!req.user) {
    // render the registration page
    res.render('auth/register', {
      title: 'Register',
      books: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  }
  else{
    return res.redirect('/books');
  }
});

// POST /register - process the registration view
router.post('/register', (req, res, next) => {
  User.register(
    new User({
        username: req.body.username,
        //password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
      }),
      req.body.password,
      (err) => {
        if(err) {
          console.log('Error insterting new user');
          if(err.name == 'UserExistsError') {
            req.flash('registerMessage', 'Registration Error: User Already Exists!');
          }
          return res.render('auth/register', {
            title: 'Register',
            books: '',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
          });
        }
        // if registration is successful
        return passport.authenticate('local')(req, res, ()=>{
          res.redirect('/books');
        });
      });
});

// GET /logout - logout the user and redirect to the home page
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to homepage
});

module.exports = router;