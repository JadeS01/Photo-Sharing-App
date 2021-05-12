var db = require("../conf/database");
const UserModel = {};
var bcrypt = require('bcrypt');

UserModel.create = (username, password, email) => {
    return bcrypt.hash(password, 15)
    .then((hashedPassword) => {
        let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());";
        return db.execute(baseSQL,[username, email, hashedPassword])
    })
    .then(([results, fields]) => {
        if(results && results.affectedRows){
            return Promise.resolve(results.insertId);
        }else{
            return Promise.resolve(-1); // means user wasn't created
        }
    })
    .catch((err) => Promise.reject(err))
}

UserModel.usernameExists = (username) => {
    return db
    .execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.emailExists = (email) => {
    return db
    .execute("SELECT * FROM users WHERE email=?", [email])
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.authenticate = (username, password) => {
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
    let userId;
    return db
    .execute(baseSQL,[username])
    .then(([results, fields]) => {
        console.log(results);
        if(results && results.length == 1) {
            userId = results[0].id;
            return bcrypt.compare(password, results[0].password);
        } else {
            return Promise.reject(-1);
        }
    })
    .then((passwordsMatch) => {
        console.log(userId);
        if(passwordsMatch){
            return Promise.resolve(userId);
        } else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}
// after registration, typeerror: cannot read property 'then' of undefined
// fixed; must return the .execute as well
// undefined user when logging in

module.exports = UserModel;