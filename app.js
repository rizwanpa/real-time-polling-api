var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();
app.io = undefined;
app.getIOInstance = function(){
  return app.io;
};
app.use(cors())

var indexRouter = require('./routes/index')(app.getIOInstance);
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const pollsRouter = require('./routes/polls');
const submitPoll = require('./routes/submitpoll')(app.getIOInstance);
const submitVote = require('./routes/submitVote');

const db = require("./models");
db.sequelize.sync();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/login', authRouter);
app.use('/admin', adminRouter);
app.use('/polls', pollsRouter);
app.use('/submitpoll', submitPoll);
app.use('/submitvote', submitVote);

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 // Add this
 if (req.method === 'OPTIONS') {

      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
  }

  next();

}); 

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
