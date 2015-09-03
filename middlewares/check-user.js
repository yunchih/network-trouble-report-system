var express = require( 'express' );
var router = express.Router();
var userDB = require( '../modules/user-db.js' );
var url = require('url');

router.use( function( req, res, next ){
    // For no network access enviroment debugging
    // req.session.permission = "nma";
    // req.session.fbId = "1161460463869930";
    // req.user = {};

    function found( result ){            
        if( result.length === 0 ){
            return res.redirect( "/static/register.html" );
        }else{
            req.session.fbId = req.user.fbId;
            req.session.permission = result[0].permission;
            return next();            
        }
    };
    if( req.session.permission === "nobody" ){
        return userDB.findUserByFBId( req.user.id, found, next );
    }else{
        return next();
    }
});

// Redirect if req pass the check-user test above.
router.get( '/check-user', function( req, res, next ){ 
    var target = req.query.redirect;
    if( typeof( target ) === 'string' ){
        var parsed = url.parse( target );
        if( parsed.host === null ){
            return res.redirect( target );
        }
    }
    return res.redirect( '/static/index.html' );
});


module.exports = router;
