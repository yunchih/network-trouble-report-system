var userDB = require('../modules/user-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/user.js' );
var permission = require( '../modules/permission.js' );

router.use( permission.request( config ) );

router.get( '/current', function( req, res, next){
    function onSuccess( user ){
        res.reuslt = user;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    userDB.getUserByFBId( req.session.fbId, onSuccess, onError );    
});



router.post( '/current', function( req, res, next ){
    function onSuccess( user ){
        return res.json({ result: "success" });
    };
    function onError( err ){
        return next( err );
    };
    userDB.updateUserByFBId( req.session.fbId, req.query );
});


router.get( '/:prop/:value', function( req, res, next){
    function onSuccess( user ){
        res.result = user;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    userDB.findUser( req.params.prop, req.params.value , onSuccess, onError );    
});

router.post( '/:prop/:value', function( req, res, next ){
    function onSuccess( result ){        
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    }
    userDB.updateUser( req.params.prop, req.params.value, req.query , onSuccess, onError );    
});

router.get( '/query', function( req, res, next ){
    function onSuccess( result ){
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    var query = JSON.parse( req.query.query );
    userDB.findUserByQuery( query, onSuccess, onError );
});

            
router.post( '/query', function( req, res, next ){
    function onSuccess( result ){        
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    var query = JSON.parse( req.query.query );
    userDB.updateUserByQuery( query, req.query.user, onSuccess, onError );
});

router.use( permission.response( config ) );

module.exports = router;
