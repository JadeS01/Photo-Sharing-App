var PostModel = require('../models/Posts')
const postMiddleware = {}

postMiddleware.getRecentPosts = function(req, res, next){
    try { // i cant use await?
        let results = PostModel.getRecentPosts(8);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'No posts yet');
        }
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = postMiddleware;