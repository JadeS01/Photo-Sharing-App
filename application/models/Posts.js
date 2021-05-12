var db = require("../conf/database");
const PostModel = {};

PostModel.create = (title, description, photopath, thumbnail, fk_userId) => {
    let baseSQL = `INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) VALUE (?,?,?,?,now(),?);;`;
    return db.execute(baseSQL,[title, description,photopath,thumbnail,fk_userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
}
 
PostModel.search = (searchTerm) => {
    let baseSQL = "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack \
        FROM posts \
        HAVING haystack like ?;";
        let sqlReadySearchTerm = "%" + searchTerm + "%";
        return db
        .execute(baseSQL, [sqlReadySearchTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));

}

PostModel.getRecentPosts = (numberOfPost) => {
    let baseSQL = 'SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT ?';
    return db
    .query(baseSQL, [numberOfPost])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

PostModel.getPostById = (postId) => {
    // res.send({params:req.params.id});
  let baseSQL = 
  `SELECT u.username, p.title, p.description, p.photopath, p.created \
  FROM users u
  JOIN posts p
  ON u.id=fk_userid
  WHERE p.id=?;`;
  // server side validation
  return db
  .execute(baseSQL,[postId])
  .then(([results, fields]) => {
      return Promise.resolve(results);
  })
  .catch(err => Promise.reject(err));
}

module.exports = PostModel;