const {getRecentPosts, getPostById} = require('../models/Posts')
const {getCommentsForPost} = require('../models/comments');
const postMiddleware = {}

postMiddleware.getRecentPosts = async function(req, res, next){
    try { // i cant use await?; use async
        let results = await getRecentPosts(8);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'No posts yet');
        }
        next();
    } catch(err) {
        next(err);
    }
}
postMiddleware.getPostById = async function(req, res, next){
    try{
        let postId = req.params.id;
        let results = await getPostById(postId);
        if(results && results.length){
            res.locals.currentPost = results[0];
            next(); // need otherwise express will hang
        }else{
            req.flash("error", "This is not the post searched for");
            res.redirect('/');
        }
    } catch (error) {
        next(err);
    }
}

postMiddleware.getCommentsByPostId = async function(req, res, next) {
    let postId = req.params.id;
    try{
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = postMiddleware;