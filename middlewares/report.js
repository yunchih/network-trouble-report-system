var reportDB = require('../modules/report-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/report.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
var response = require( '../modules/permission.js' ).response( config );
var ObjectId = require('mongodb').ObjectId;

module.exports = function( reportCollection ){

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

    
    router.get( '/current/:status', function( req, res, next){
        if( !checkRequest( req, res ) ) return;

        var status = req.params.status;

        reportCollection.find( { fb_id: req.session.fbId,
                           status: status } )
            .toArray( handleResponse( req, res, next ) );
        
    });


    router.get( '/current', function( req, res, next ){
        if( !checkRequest( req, res ) ) return;

        reportCollection.find( { fb_id: req.session.fbId } )
            .toArray( handleResponse( req, res, next ) );
    });

    router.post( '/current', function( req, res, next ){
        if( !checkRequest( req, res ) ) return false;

        function onFind( err, result ){
            if( err !== null ){ return next( err ); }
            var report = req.query;
            report.fb_id = req.session.fbId;
            report.status = "unsolved";
            report.timestamp = Date.now();
            if( result.length !== 0 ){
                return reportCollection.update( {fb_id: req.session.fbId, status: "unsolved" },
                                          {$set: report}, handle( req, res, next ) );
            }else{
                return reportCollection.insertOne( report, handle( req, res, next) );
            }
        };

        return reportCollection.find( { fb_id: req.session.fbId, status: "unsolved" } )
            .toArray( onFind );

    });


    router.get( '/all/status/:status', function( req, res, next){
        if( !checkRequest( req, res ) ) return;
        reportCollection.find( { status: req.params.status } )
            .toArray( handleResponse( req, res, next ) );        
    });

    router.get( '/all/period/:start/:end', function( req, res, next){
        if( !checkRequest( req, res ) ) return;

        var timeStart = Number( req.params.start );
        var timeEnd = Number( req.params.end );

        reportCollection.find( { timestamp:
                           { $gte: timeStart,
                             $lt: timeEnd }
                         } )
            .toArray( handleResponse(req, res, next ) );
    });

    // To be implemented
    router.get( '/all/:prop/:value', function( req, res, next){
        if( !checkRequest( req, res ) ) return;

        var query = {};
        query[req.params.prop] = req.params.value;
        reportCollection.find( query )
            .toArray( handleResponse( req, res, next ) );
    });


    router.post( '/id/:reportId', function( req, res, next ){
        if( !checkRequest( req, res ) ) return false;
        var reportId = req.params.reportId;
        if( !ObjectId.isValid( reportId ) ){
            return  res.json( { error: "invalid reportID" } );
        }        
        return reportCollection.update( { _id: new ObjectId( reportId ) },
                           { $set: req.query }, handle( req, res, next ) );
    });   

    return router;
};
