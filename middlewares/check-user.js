var express = require( 'express' );
var router = express.Router();
var userDB = require( '../modules/user-db.js' );
var url = require('url');

module.exports = function( db ){
    var userCollection = db.collection("users");
    
    router.use( function( req, res, next ){
        if( ! req.session.permission ){
            return userCollection
                .find( { fbId: req.user.id } )
                .toArray( function( err, result ){
                    if( err !== null ){
                        return next(err);
                    }else{
                        req.session.fbId = req.user.id;
                        if( result.length !== 0 ){
                            req.session.permission = result[0].permission;
                        }else{                            
                            req.session.permission = "nobody";
                        }            
                        return next();            
                    }
                });        
        }else{
            return next();
        }
    });

    // Redirect user according to permission.
    router.get( '/check-user', function( req, res, next ){ 
        if( req.session.permission === "nobody" ){
            res.redirect( "/static/register.html" );
        }
        var target = req.query.redirect;
        if( typeof( target ) === 'string' ){
            var parsed = url.parse( target );
            if( parsed.host === null ){
                return res.redirect( target );
            }
        }
        return res.redirect( '/static/index.html' );
    });
    return router;
};
