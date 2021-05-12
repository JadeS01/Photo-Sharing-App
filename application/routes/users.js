var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

const UserModel = require('../models/Users');

//database
var db = require('../conf/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registration', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  
  // do server side validation

  UserModel.usernameExists(username)
  .then((userDoesNameExist) => {
    if(userDoesNameExist){
      throw new UserError(
              "Registration Failed: Username already exists",
              "/registration",
              200
            );
    }else{
      UserModel.emailExists(email);
    }
  })
  .then((emailDoesExist) => {
    if(emailDoesExist){
      throw new UserError(
              "Registration Failed: Email already exists",
              "/registration",
              200
            );
    }else{
      return UserModel.create(username, password, email);
    }
  })
  .then((createdUserId) => {
    if(createdUserId < 0){
      throw new UserError(
              "Server Error, user could not be created",
              "/registration",
              500
            );
    }else{
      successPrint("User.js --> User was created");
          req.flash('success', 'User account has been made');
          res.redirect('/login');
    }
  })
  .catch((err) => {
    errorPrint("User couldn't be made", err);
    if(err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    }else{
      next(err);
    }
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
  let userId;
  UserModel.authenticate(username, password)
  .then((loggedUserId) => {
    console.log(loggedUserId);
    if(loggedUserId > 0){
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId = loggedUserId;
      res.locals.logged = true;
        // res.cookie("logged", username, {expires: new Date(Date.now()+900000), httpOnly: false});
        // res.redirect('/');
      req.flash('success', 'You have been logged in');
      req.session.save(err => {res.redirect("/")}); // apply to all redirects for flash
    } else {
      throw new UserError("Invalid login", "/login", 200);
    }
  }) 
  .catch((err) => {
    errorPrint("User login failed");
    if(err instanceof UserError) {
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      res.redirect('/login');
    }else{
      next(err);
    }
  });

});

router.post('/logout',(req, res, next) => {
  // destroys session
  req.session.destroy((err) => {
    if(err) {
      errorPrint('Session could not be destroyed');
      next(err);
    }else{
      successPrint('Session was destroyed');
      res.clearCookie('csid');
      res.json({status: "OK", message: "user is logged out"});
    }
  })
})

module.exports = router;

//successPrint(`User ${username} is logged in`);
//       res.locals.logged = true;
        // res.cookie("logged", username, {expires: new Date(Date.now()+900000), httpOnly: false});
        // res.redirect('/');
//      res.render('index');