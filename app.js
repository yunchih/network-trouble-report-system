var express = require('express');
var app = express();

var logger = require('morgan');

var dbConfig = require('./config/db.js');
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


app.use( '/static', express.static('static') );


// configure Express
// app.use(logger());
// app.use(bodyParser());

app.use(session({
    secret: 'fdg  hjg oi hghdjfg js hgsha;hga;rua urjoiuh h',
    store: new MongoStore({ url: dbConfig.url })
}));


app.use(passport.initialize());
app.use(passport.session());


var onFBLogin = function( accessToken, refreshToken, profile, done) {
    done( null, profile );
};

app.use( '/fb-auth', fbAuth( onFBLogin ) );

app.use( function(req, res, next) {
    if (req.isAuthenticated()) {
        req.session.permission = "nobody";
        return next();
    }
    else{ return res.json( { error: "fb not login" } ); }
});


app.use( '/register', register );

app.use( checkUser );

app.use( '/api/1.0/user/', user );
app.use( '/api/1.0/report/', report );

app.listen( 3000 );
