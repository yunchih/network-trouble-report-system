var express = require( 'express' );
var router = express.Router();
var userDB = require( '../modules/user-db.js' );

router.use( function( req, res, next ){
    // For no network access enviroment debugging
    req.session.permission = "nma";
    req.session.fbId = "1161460463869930";
    req.user = {};

    if( ! req.user ){
        return res.send( "not login" );
    }
    function found( result ){            
        if( result.length === 0 ){
            var user = {
                fbId: req.user.id,
                permission: "nma"
            };
            function added( result ){
                console.log( "Create a new user." );
                req.session.fbId = user.fbId;
                req.session.permission = user.permission;           
                next();
            };
            userDB.addUser( user, added, next ); 
        }else{
            req.session.fbId = req.user.fbId;
            req.session.permission = result[0].permission;
            next();            
        }
    };
    if( ! req.session.permission ){
        return userDB.findUserByFBId( req.user.id, found, next );
    }else{
        return next();
    }
});

module.exports = router;
