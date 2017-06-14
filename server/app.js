let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cros = require('cors');
let DB = require('./config/db');
let index = require('./routes/index');
let users = require('./routes/users');
let compression = require('compression');

process.env.TZ = 'Asia/Yerevan';

let app = express();

//define option for cross domain request
let crosOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

//check node env. and connect db
if (process.env.NODE_ENV === 'production') {
  DB.connect(DB.MODE_PRODUCTION);

}  else {
  DB.connect(DB.MODE_TEST);
}

//setup modules
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cros(crosOptions));
app.use(express.static(__dirname + '../web/dist'));

//setup routes
app.use('/', index);
app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
