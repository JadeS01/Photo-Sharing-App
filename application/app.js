var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;

var dbRouter = require('./routes/dbtest');

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname,"views/layouts"),
        partialsDir: path.join(__dirname,"views/partials"),
        extname:".hbs",
        defaultLayout:"home",
        helpers: {
            //if more helpers needed, can register here
        }
    })
);

app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// uploading images
app.use("/public",express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
})

app.use('/', indexRouter);
app.use('/dbtest', dbRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
    errorPrint(err);
    res.render('error', { err_message: err });
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send('something went wrong with your db');
})
module.exports = app;
