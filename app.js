var express = require('express');
var app = express();

var logger = require('morgan');

var database = require('./modules/db.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//var passport = require('passport');
//var FacebookStrategy = require('passport-facebook').Strategy;

var auth = require( './modules/auth.js' )();
var fbAuth = require('./middlewares/fb-auth.js');
var checkUser = require( './middlewares/check-user.js' );

var bodyParser = require("body-parser");
var user = require('./middlewares/user.js');
var report = require( './middlewares/report.js' );
var register = require( './middlewares/register.js' );
var morgan = require('morgan');



database.init( function( db ){
    
    app.use(express.static('static'));

    app.use(morgan('dev'));
    
    app.use( '/api/1.0/auth', fbAuth(db.collection('users'), auth) );
    
    app.use( auth.session );
    app.use( auth.verify );

    app.get( '/api/1.0/auth/renew', auth.renew );
    
    app.use( '/api/1.0/register', register(db.collection('users'), auth) );

    app.use( '/api/1.0/user/', user(db.collection('users')) );
    app.use( '/api/1.0/report/', report(db.collection('reports')) );

    app.use( function( req, res, next){
        res.status(404).json( {error: "Not found."} );
    });
    
    app.listen( 3000 );
});
