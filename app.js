var path = require('path');
var http = require('http');
var request = require('request');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
var User = require('./models/user.js')

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/holistichealth');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
	secret: 'kjsdfjkfdshjkdsfhjk',
	resave: false,
	saveUninitialized: false
}))

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());


passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

var localStrategy = new LocalStrategy(function(username, password, done){
	console.log('Local!!')
  User.findOne({username: username}, function(err, user){

    if(err) return done(err);

    if(!user) return done(null, false);

    user.comparePassword(password, function(err, isMatch){

      if(err) return done(err);

      if(isMatch){
        return done(err, user);
      } else {
        return done(null, false);
      }
    });
  });
});

passport.use(localStrategy);


// We don't really need to export anything from this file, since just
// including it is enough. However, this helpful middleware allows us
// to block access to routes if the user isn't authenticated by redirecting
// them to the login page. We'll see this used in app.js
ensureAuthenticated = function(req, res, next){

  // If the current user is logged in...
  if(req.isAuthenticated()){

    // Middleware allows the execution chain to continue.
    return next();
  }

  // If not, redirect to login
  res.redirect('/');
}
app.get('/', indexController.index);
app.post('/signup', indexController.signup);
app.get('/home', ensureAuthenticated, indexController.home);
app.post('/login', passport.authenticate('local', {successRedirect : '/home', failureRedirect : '/'}));
app.get('/addtreatment', ensureAuthenticated, indexController.addtreatment);
app.post('/posttreatment', indexController.posttreatment);
app.post('/rating/plusone', indexController.plusone);
app.post('/rating/minusone', indexController.minusone);
app.get('/about', indexController.about);
app.get('/contactinfo', indexController.contactinfo);

var port = process.env.PORT || 6850;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
