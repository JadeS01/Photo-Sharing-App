var express = require("express");
var router = express.Router();
const {successPrint, errorPrint} = require('../helpers/debug/debugprinters');
const { create } = require('../models/comments');


router.post('/create', (req, res, next) => { 
    console.log(req.session);
    if(!req.session.username){
        errorPrint("Must be logged in to comment");
        res.json({
            code: -1,
            status: "danger",
            message: "Must be logged in to comment"
        });
    } else {
        let {comment, postId} = req.body;
        let username = req.session.username
        let userId = req.session.userId 

    create(userId, postId, comment)
    .then((wasSuccessful) => {
        console.log(wasSuccessful);
        if(wasSuccessful !== -1){
            successPrint(`comment was created for ${username}`);
            res.json({
                code: 1,
                status: "success",
                message: "comment created",
                comment: comment,
                username: username
            });
        }else{
            errorPrint('comment was not saved');
            res.json({
                code: -1,
                status: "danger",
                message: "comment not created",
            });
        }
    })
    .catch((err) => next(err)); 
    }
});

// don't forget to put into app.js for it to post


module.exports = router;