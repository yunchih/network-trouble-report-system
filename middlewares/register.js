var userDB = require('../modules/user-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/register.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
// var response = require( '../modules/permission.js' ).response( config );

module.exports = function( userCollection, auth ){
    
    router.post( '/', function( req, res, next ){
        if( !checkRequest( req, res ) ){
            return false;
        }

        if( req.query.agree !== "true" ){
            return res.json( {error: "User must agree with term of service before registration"} ); 
        }

        delete req.query.agree;
        
        var user = req.query;
        user.fb_id = req.session.fbId;
        user.permission = "general";

        function added( result ){
            console.log( "Create a new user." );
            var accessToken = auth.encode( {
                fb_id: user.id,
                permission: user.permission
            } );
            res.send( {
                success: true,
                access_token: accessToken
            } );
        };
            
        return userDB.addUser( user, added, next ); 
    });

    return router;
};
