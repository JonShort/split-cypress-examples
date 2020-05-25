require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var SplitFactory = require('@splitsoftware/splitio').SplitFactory;

var indexRouter = require('./routes/index');

const createApp = async () => {
  var app = express();
  
  // Instantiate the SDK
  const splitFactory = SplitFactory({
    core: {
      authorizationKey: process.env.SPLIT_API_KEY,
    },
    features: path.join(__dirname, '.split.yml'),
  });

  // Initialize the client
  const splitClient = splitFactory.client();

  const waitForClient = new Promise((resolve, reject) => {
    // Wait for the SDK_READY event, then resolve the promise
    splitClient.on(splitClient.Event.SDK_READY, () => {
      resolve();
    });
  
    // If split SDK times out, reject the promise
    splitClient.on(splitClient.Event.SDK_READY_TIMED_OUT, () => {
      reject(new Error(`
        Failed split.io initialization, timeout exceeded.
        Try instantiating the split factory with debug: true
      `));
    });
  });

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  // Make the split client accessible at req.splitClient
  app.use((req, res, next) => {
    req.splitClient = splitClient;
    next();
  });
  
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use('/', indexRouter);
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  await waitForClient;

  return app;
};


module.exports = createApp;
