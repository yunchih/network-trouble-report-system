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



database.init( function( db ){

    app.use( '/', express.static('static') );
    

    app.use( '/api/1.0', (function(){
        var router = express.Router();
        router.use( '/auth', fbAuth(db.collection('users'), auth) );

        router.use( auth.session );
        router.use( auth.verify );

        router.get( '/auth/renew', auth.renew );
        
        router.use( '/register', register(db.collection('users'), auth) );

        router.use( '/user/', user(db.collection('users')) );
        router.use( '/report/', report(db.collection('reports')) );
        return router;
    })());
    
    app.use( function( req, res, next){
        res.status(404).json( {error: "Not found."} );
    });
    
    app.listen( 3000 );
});
