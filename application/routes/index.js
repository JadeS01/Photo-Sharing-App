var express = require('express');
var router = express.Router();

/* GET home page. */
//localhost:3000
router.get('/', function(req, res, next) {
 
  res.render('index',{title: "Jade's App"});
});

router.get('/login',(req,res,next) => {
  res.render("login",{title: "Log In"});
});

router.get('/registration',(req,res,next) => {
  res.render("registration", {title: "Registration"});
});

router.get('/imagepost',(req,res,next) => {
  res.render("imagepost",{title: "Image Post"});
});

router.get('/postimage',(req,res,next) => {
  res.render("postimage",{title:"Post an Image"});
});

router.get('/home',(req,res,next) => {
  res.render("home");
});


module.exports = router;
