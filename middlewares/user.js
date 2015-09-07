//var userDB = require('../modules/user-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/user.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
var response = require( '../modules/permission.js' ).response( config );

module.exports = function( userCollection ){
    
    var handleResponse = function( req, res, next ){
        return function( err, result ){
            if( err !== null ){
                return next( err );
            }else{
                res.result = result;
                return response( req, res );
            }
        };
    };

    var handle = function( req, res, next ){
        return function( err, result ){
            if( err !== null ){
                return next( err );
            }else{
                res.result = result;
                return res.json( { success: true } );
            }
        };
    };

    
    router.get( '/current', function( req, res, next){
        if( !checkRequest( req, res ) ){
	    return;
        }            
        userCollection
            .find( { "fb_id": req.session.fbId } )
            .toArray( handleResponse(req, res, next ));        

    });

    router.post( '/current', function( req, res, next ){
        if( !checkRequest( req, res ) ){
            return;
        }
        
        userCollection
            .update( { "fb_id": req.session.fbId },
                     { $set: req.query },
                     handle( req, res, next ) );        
    });

    router.get( '/:prop/:value', function( req, res, next){
        if( !checkRequest( req, res ) ){
	    return;
        }

        var query = {};
        query[req.params.prop] = req.params.value;
        userCollection
            .find( query )
            .toArray( handleResponse( req, res, next ) );        
    });

    router.post( '/:prop/:value', function( req, res, next ){
        if( !checkRequest( req, res ) ){
	    return;
        }

        var query = {};
        query[req.params.prop] = req.params.value;

        userCollection
            .update( query, { $set: req.query }, handle( req, res, next ) );        
    });

    router.get( '/query', function( req, res, next ){
        if( !checkRequest( req, res ) ){
	    return;
        }
        
        var query = JSON.parse( req.query.query );
        
        userCollection
            .find( query )
            .toArray( handleResponse( req, res, next ) );
    });

    
    router.post( '/query', function( req, res, next ){
        if( !checkRequest( req, res ) ){
	    return;
        }
        
        function onSuccess( result ){        
            res.result = result;
            return next();
        };
        function onError( err ){
            return next( err );
        }

        var query = JSON.parse( req.query.query );
        userCollection
            .update( query, {$set: req.query.user}, handle( req, res, next ) );
    });

    return router;

};
