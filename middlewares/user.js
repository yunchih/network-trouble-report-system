var userDB = require('./modules/user-db.js');
var express = require('express');
var router = express.Router();
var permissionList = require( '../config/user.js' ).permissionList;


/**
 * filter the request or output of database to ensure that user can only
   access the data which he/she has permission to get.
 * @param {String} currentPermission - the permission of the current user. 
 * @param {String} operation - the operation the user does. 
    It should be the path of the URL with / replaced by - and ignoring :.
 * @param {Object} data - it may be the result from database,
    which may contain some information the user should not access.
*/
function filterByPermission( currentPermission, operation , data ){
    var readPermission = permissionList[currentPermission].user[operation];
    var filtered = {};
    for( var property of readPermission ){
        filtered[property] = data[property];
    }
    return filtered;
};

router.get( '/user/current', function( req, res, next){
    function onSuccess( user ){
        var filtered = filterByPermission( res.session.permission,
                                           'current-get',
                                           user );
        return res.send( filtered );
    };
    function onError( err ){
        return next( err );
    }
    userDB.getUserByFBId( req.session.fbId, onSuccess, onError );    
});



router.post( '/user/current', function( req, res, next ){
    function onSuccess( user ){
        return res.json({ result: "success" });
    };
    function onError( err ){
        return next( err );
    };
    var userSetings = filterByPermission( req.session.permission, 'current-post', req.query );
    userDB.updateUserByFBId( req.session.fbId, userSetings );
});


router.get( '/user/:prop/:value', function( req, res, next){
    function onSuccess( user ){
        var filtered = filterByPermission( res.session.permission,
                                           'prop-value-get',
                                           user );
        return res.send( filtered );
    };
    function onError( err ){
        return next( err );
    }
    userDB.findUser( req.params.prop, req.params.value , onSuccess, onError );    
});

router.post( '/user/:prop/:value', function( req, res, next ){
    function onSuccess( result ){        
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    }
    var userSetings = filterByPermission( req.session.permission,
                                          'prop-value-post',
                                          req.query );
    userDB.updateUser( req.params.prop, req.params.value, userSetings , onSuccess, onError );    
});

router.get( '/user', function( req, res, next ){
    function onSuccess( result ){
        var filtered = filterByPermission( res.session.permission,
                                           'get',
                                           result );
        return res.send( filtered );
    };
    function onError( err ){
        return next( err );
    }
    var query = JSON.parse( req.query.query );
    userDB.findUserByQuery( query , onSuccess, onError );
});

            
router.post( '/user', function( req, res, next ){
    function onSuccess( result ){        
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    }
    var query = JSON.parse( req.query.query );
    var userSetings = filterByPermission( req.session.permission,
                                          'post',
                                          req.query );
    userDB.findUserByQuery( query, userSetings, onSuccess, onError );
}


