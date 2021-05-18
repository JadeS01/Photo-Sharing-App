var db = require("../conf/database");
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSQL = `INSERT INTO comments (comments, fk_postid, fk_authorid) VALUES (?,?,?);`;
    return db
    .execute(baseSQL, [userId, postId, comment])
    .then(([results, fields]) => {
        
        if(results && results.affectedRows){
            return Promise.resolve(results.insertId);
        }else{
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
};

// set id to null mysql for anonymous comments if wanted
CommentModel.getCommentsForPost = (postId) => {
    let baseSQL = `SELECT u.username, c.comments, c.created, c.id
    FROM comments c
    JOIN users u
    on u.id=fk_authorid
    Where c.fk_postid=?
    ORDER BY c.created DESC`;
    return db.query(baseSQL, [postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch(err => Promise.reject(err));
};

module.exports = CommentModel;