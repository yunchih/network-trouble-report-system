var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require("body-parser");
var fbAuth = require( './middlewares/fb-auth.js' );

var app = express();

// configure Express
app.use(logger());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));

var onFBLogin = function( accessToken, refreshToken, profile, done) {
    console.log( profile );
    done( null, profile );
};

app.use( '/fb-auth', fbAuth( onFBLogin ) );

app.listen( 3000 );
