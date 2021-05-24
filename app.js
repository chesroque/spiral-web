const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

require('dotenv').config();
const { PORT, MONGO_URI } = process.env;

const app = express();

// Initiate Mongo Server
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const editRouter = require('./routes/edit');
const profileRouter = require('./routes/profile');
const checkoutRouter = require('./routes/checkout');
const product = require('./routes/product');
const user = require('./routes/user');

app.use(
	session({
		secret: 'yourSecret',
		resave: true,
		saveUninitialized: true,
	}),
);

// Passport
const User = require('./model/User.js');
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const { renderProducts } = require('./controller/productController');

app.get('/', renderProducts);

app.use('/settings', editRouter);
app.use('/profile', profileRouter);
app.use('/checkout', checkoutRouter);
app.use('/product', product);
app.use('/user', user);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
// 	next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get('env') === 'development' ? err : {};

// 	// render the error page
// 	res.status(err.status || 500);
// 	res.render('error');
// });

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});

module.exports = app;
