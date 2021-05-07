var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
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

router.get('/post/:id(\\d+)', (req, res, next) => {
  // res.send({params:req.params.id});
  let baseSQL = 
  "SELECT u.username, p.title, p.description, p.photopath, p.created \
  FROM users u \
  JOIN posts p \
  ON u.id=fk_userid \
  WHERE p.id=?;";

  let postId = req.params.id;
  // server side validation
  db.execute(baseSQL,[postId])
  .then(([results, fields]) => {
    if(results && results.length){
      let post = results[0];
      res.render('imagepost', {currentPost: post});
    }else{
      req.flash('error', 'Incorrect post');
      req.redirect('/');
    }
  })

});

module.exports = router;
