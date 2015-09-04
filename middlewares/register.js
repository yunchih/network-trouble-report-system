var userDB = require('../modules/user-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/register.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
// var response = require( '../modules/permission.js' ).response( config );


router.post( '/', function( req, res, next ){
    if( !checkRequest( req, res ) ){
        return false;
    }

    if( req.query.agree !== "true" ){
        return res.json( {error: "User doesn't agree with term of service"} ); 
    }

    delete req.query.agree;
    
    var user = req.query;
    user.fbId = req.user.id;
    user.permission = "general";

    function added( result ){
        console.log( "Create a new user." );
        req.session.fbId = user.id;
        req.session.permission = user.permission;           
        res.send( { success: "true" } );
    };
    
    userDB.addUser( user, added, next ); 
});

module.exports = router;
