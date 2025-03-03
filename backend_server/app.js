var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var logger = require('morgan');
const cors = require('cors');
console.log(process.env);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const commentRouter = require('./routes/commentRouter');

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();

app.use(cors());

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// API routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve images from the frontend build/assets/images directory
app.use('/images', express.static(path.join(__dirname, '../frontend/build', 'assets', 'images')));

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;