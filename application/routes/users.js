const { request } = require('express');
const e = require('express');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();


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
const username = document.getElementById('username')
const password = document.getElementById('password')
const redo = document.getElementById('redo')
const register = document.getElementById('register')
const errorElement = document.getElementById('error')
const ages = document.querySelectorAll('input[name="age"]');
let value;
var req = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/;
var check = /^[a-zA-Z]/;

register.addEventListener('submit', (e) => {
    let messages = []
    if (username.value == '' || username.value == null || username.value.length < 3) {
        messages.push('\nUsername must be 3+ alphanumeric characters long')
    }
    if(!check.test(username.value)) {
        messages.push('\nUsername must begin with a letter')
    }

    if (password.value.length < 8) {
        messages.push('\nPassword must be 8+ characters long')
    }

    if (!req.test(password.value)) {
        messages.push('\nPassword must have at least 2 letters of different cases, 1 number, and 1 special character')
    }

    if(password.value != redo.value) {
        messages.push('\nPasswords must match')
    }

    for (const age of ages) {
        if(age.checked) {
            value = age.value;
            break;
        }
    }
    var ageno = "no";
    if(value == ageno) {
        messages.push('\nYou must be 13 or older');
    }

    if (messages.length > 0) {
        e.preventDefault()
        errorElement.innerText = messages.join(', ')
        alert(messages.join(', '))
    }
})

// end validation



  db.execute("SELECT * FROM users WHERE username=?", [username])
  .then(([results, fields]) => {
    if(results && results.length == 0) {
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
    } else {
      throw new UserError(
        "Registration Failed: Username already exists",
        "/registration",
        200
      );
    }
  })
  .then(([results, fields]) => {
    if(results && results.length == 0) {
      return bcrypt.hash(password,15);
    } else {
      throw new UserError(
        "Registration Failed: Email already exists",
        "/registration",
        200
      );
    }
  })
  .then((hashedPassword) => {
      let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());"
      return db.execute(baseSQL,[username, email, hashedPassword])
  })
  .then(([results, fields]) => {
    if(results && results.affectedRows) {
      successPrint("User.js --> User was created");
      req.flash('success', 'User account has been made');
      res.redirect('/login');
    } else {
      throw new UserError(
        "Server Error, user could not be created",
        "/registration",
        500
      );
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

  // validation
  const username = document.getElementById('username');
  const password = document.getElementById('password');

  register.addEventListener('submit', (e) => {

    if (username.value == '' || username.value == null || username.value.length < 3) {
      messages.push('\nUsername must be 3+ alphanumeric characters long')
  }
    
    if (password.value.length < 8) {
    messages.push('\nPassword must be 8+ characters long')
    }

    if (messages.length > 0) {
      e.preventDefault()
      errorElement.innerText = messages.join(', ')
      alert(messages.join(', '))
  }
  })



  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
  let userId;
  db.execute(baseSQL,[username])
  .then(([results, fields]) => {
    if(results && results.length == 1) {
        // success print at bottom
        let hashedPassword = results[0].password;
        userId = results[0].id;
        return bcrypt.compare(password, hashedPassword);
    }else{
      throw new UserError("Invalid username and/or password", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if(passwordsMatched){
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId = userId;
      res.locals.logged = true;
        // res.cookie("logged", username, {expires: new Date(Date.now()+900000), httpOnly: false});
        // res.redirect('/');
      req.flash('success', 'You have been logged in');
      res.redirect("/home");
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
  })

});

router.post('/logout',(req, res, nexy) => {
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