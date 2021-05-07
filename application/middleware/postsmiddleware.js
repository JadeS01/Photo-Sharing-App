var db = require('../conf/database');
const postMiddleware = {}

postMiddleware.getRecentPosts = function(req, res, next){
    // getch 8 recent posts, can put ? instead
    let baseSQL = 'SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 8';
    db.execute(baseSQL, [])
    .then(([results, fields]) => {
        res.locals.results = results;
        if(results && results.length == 0){
            req.flash('error', 'No posts made!');
        }
        next();
    })
    .catch((err) => next(err));
}

module.exports = postMiddleware;