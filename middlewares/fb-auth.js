var express = require('express')
, passport = require('passport')
//, util = require('util')
, FacebookStrategy = require('passport-facebook').Strategy
//, logger = require('morgan')
, session = require('express-session')
//, bodyParser = require("body-parser")
, fbConfig = require( "../config/fb-app.js" );
var userDB = require( "../modules/user-db.js" );

var init = function( onLogin ){

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Facebook profile is serialized
    //   and deserialized.
    passport.serializeUser(function(user, done) {
        done( null, user );        
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    // Use the FacebookStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Facebook
    //   profile), and invoke a callback with a user object.    
    passport.use(new FacebookStrategy({
        clientID: fbConfig.appId,
        clientSecret: fbConfig.appSecret
        //callbackURL: "http://localhost:3000/fb-auth/login/callback"
    },
                                      function(accessToken, refreshToken, profile, done) {
                                          // asynchronous verification, for effect...
                                          process.nextTick(function () {
                                              onLogin( accessToken, refreshToken, profile, done);
                                          });
                                      }
                                     ));
   

    var router = express.Router();

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    router.use(passport.initialize());
    router.use(passport.session());

    // GET /auth
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Facebook authentication will involve
    //   redirecting the user to facebook.com.  After authorization, Facebook will
    //   redirect the user back to this application at /auth/facebook/callback
    router.get('/login',function( req, res, next){
        var redirect = encodeURIComponent( req.query.redirect || "/" );
        var callback = "/fb-auth/login/callback?redirect=" + redirect;
        return passport.authenticate('facebook',
                                     {callbackURL: callback}
                                    )( req, res, next);
    });

    // GET /auth/facebook/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    router.get('/login/callback', function( req, res, next){        
        var redirect = encodeURIComponent( req.query.redirect || "/" );
        var callback = "/fb-auth/login/callback?redirect=" + redirect;
        var checkUser = "/check-user?redirect=" + redirect;
        return passport.authenticate('facebook',
                                     {
                                         callbackURL: callback,
                                         successRedirect: checkUser,
                                         failureRedirect: "/fb-auth/login" }
                                    )( req, res, next);                   
        
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });


    router.get('/auth/facebook/login/:id', function(req,res,next) {
        passport.authenticate(
            'facebook', 
            {callbackURL: '/fb-auth/auth/facebook/login_callback/'+req.params.id }
        )(req,res,next);
    });

    router.get('/auth/facebook/login_callback/:id', function(req,res,next) {
        passport.authenticate(
            'facebook',
            {
                callbackURL:"/fb-auth/auth/facebook/login_callback/"+req.params.id
                , successRedirect:"/login_ok.html"
                , failureRedirect:"/login_failed.html"
            }
        ) (req,res,next);
    });
    
    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    // function ensureAuthenticated(req, res, next) {
    //     if (req.isAuthenticated()) { return next(); }
    //     res.redirect('/login')
    // }

    console.log( "Facebook strategy init successfully" );
    
    return router;
};

module.exports = init;
