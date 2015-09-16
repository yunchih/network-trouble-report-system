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

var watch = require('./modules/watch.js');
var test = require( './middlewares/test.js' );

app.use(morgan('dev'));

database.init( function( db ){    

    watch( db.collection('users') );
    
    app.use( '/', express.static('static') );

    app.use( '/test', test );
    
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
        res.status(404).json( {error: "Not found.", req: req.originalUrl } );
    });

    var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    app.listen( server_port, server_ip_address );
    console.log( (new Date()) + "App listening on " + server_ip_address + ":" + server_port );

});
