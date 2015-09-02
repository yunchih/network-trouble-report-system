var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require("body-parser");
var fbAuth = require('./middlewares/fb-auth.js');
var test = require( './middlewares/test.js' );
var auth = require( './middlewares/auth.js' );
var user = require('./middlewares/user.js');
var report = require( './middlewares/report.js' );

var app = express();


app.use( express.static('public') );

// configure Express
// app.use(logger());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


var onFBLogin = function( accessToken, refreshToken, profile, done) {
    done( null, profile );
};

app.use( '/fb-auth', fbAuth( onFBLogin ) );
app.use( auth );

app.use( '/api/1.0/user/', user );
app.use( '/api/1.0/report/', report );

app.use( '/test', test );

app.listen( 3000 );
