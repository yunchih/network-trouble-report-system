var userDB = require('../modules/user-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/new-user.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
// var response = require( '../modules/permission.js' ).response( config );


router.post( '/', function( req, res, next ){
    checkRequest( req, res );

    if( ! req.query.agree ){
        return res.json( {error: "User doesn't agree with term of service"} ); 
    }

    delete req.query.agree;
    
    var user = req.query;
    user.fbId = req.user.fbId;
    user.permission = "general";

    function added( result ){
        console.log( "Create a new user." );
        req.session.fbId = user.fbId;
        req.session.permission = user.permission;           
        res.send( { success: "true" } );
    };
    
    userDB.addUser( user, added, next ); 
});

module.exports = router;
