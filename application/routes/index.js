var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById, getCommentsByPostId} = require('../middleware/postsmiddleware');

var db = require('../conf/database');
/* GET home page. */
//localhost:3000
router.get('/', getRecentPosts, function(req, res, next) {
 
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

router.use('/postImage', isLoggedIn);
router.get('/postimage',(req,res,next) => {
  res.render("postimage",{title:"Post an Image"});
});

router.get('/home',(req,res,next) => {
  res.render("home");
});

router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) => {
      res.render('imagepost', {title: `Post ${req.params.id}`});
});

module.exports = router;
