var createError = require('http-errors');
var express = require('express');
const bodyParser= require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const InitiateMongoServer = require("./config/db");
const session = require('express-session');
var cookieParser = require('cookie-parser')

// Initiate Mongo Server
InitiateMongoServer();

var indexRouter = require('./routes/index');
var editRouter = require('./routes/edit');
var profileRouter = require('./routes/profile');
var checkoutRouter = require('./routes/checkout');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');



var app = express();
/*app.use(session({
  secret : 'yourSecret',
  resave : false,
  saveUninitialized : false,
  }));*/

app.use(cookieParser())



var mongodb= require('mongodb');
var MongoClient= mongodb.MongoClient;
var URL = 'mongodb://127.0.0.1:27017/mainDB';

var sess;
var db;
var error;
var waiting = []; // Callbacks waiting for the connection to be made

MongoClient.connect(URL,function(err,database){
  error = err;
  db = database;

  waiting.forEach(function(callback) {
    callback(err, database);
  });
});

module.exports = function(callback) {
  if (db || error) {
    callback(error, db);
  } else {
    waiting.push(callback);
  }
}


// make our db accessible to our router
/*app.use(function(req, res, next) {
	req.db = db;
	next();
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/edit', editRouter);
app.use('/profile', profileRouter);
app.use('/checkout', checkoutRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
