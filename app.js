var express = require('express');
var app = express();

var logger = require('morgan');

var database = require('./modules/db.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var fbAuth = require('./middlewares/fb-auth.js');
var checkUser = require( './middlewares/check-user.js' );

var bodyParser = require("body-parser");
var user = require('./middlewares/user.js');
var report = require( './middlewares/report.js' );
var register = require( './middlewares/register.js' );


database.init( function( db ){

    app.use( '/static', express.static('static') );
   
    app.use(session({
        secret: 'fdg  hjg oi hghdjfg js hgsha;hga;rua urjoiuh h',
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({ db: db, ttl: 3600, touchAfter: 3600 })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    var onFBLogin = function( accessToken, refreshToken, profile, done) {
        done( null, profile );
    };

    app.use( '/fb-auth', fbAuth( onFBLogin ) );

    app.use( function(req, res, next) {
        if (req.isAuthenticated()) {
            //req.session.permission = req.session.permission || "nobody";
            return next();
        }
        else{ return res.json( { error: "fb not login" } ); }
    });

    app.use( checkUser(db) );

    app.use( '/api/1.0/register', register );

    app.use( '/api/1.0/user/', user(db) );
    app.use( '/api/1.0/report/', report(db) );

    app.listen( 3000 );
});
