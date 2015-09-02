var reportDB = require('../modules/report-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/report.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
var response = require( '../modules/permission.js' ).response( config );

            
router.get( '/current/:status', function( req, res, next){
    if( !chechRequest( req, res ) ) return;
    
    function onSuccess( result ){
        res.result = result;
        return response( req, res );
    };
    function onError( err ){
        return next( err );
    };
    var status = req.params.status;
        
    reportDB.getReportOfStatusOfFbId( req.session.fbId, status,  onSuccess, onError );    
});


router.get( '/current', function( req, res, next ){
    if( !chechRequest( req, res ) ) return;

    function onSuccess( result ){
        res.result = result;
        return response( req, res );
    };
    function onError( err ){
        return next( err );
    };
    reportDB.getReportOfFbId( req.session.fbId, onSuccess, onError );
});

router.post( '/current', function( req, res, next ){
    if( !chechRequest( req, res ) ) return;

    function onGetSuccess( result ){
        var report = req.query;
        report.fbId = req.session.fbId;
        report.timestamp = Date.now();
        report.status = "unsolved";
        if( result.length === 0 ){
            function onAddSuccess( result ){
                return res.json( { result: "success" } );
            };
            return reportDB.addReport( report, onAddSuccess, onError );
        }else{
            function onUpdateSuccess( result ){
                return res.json( { result: "success" } );
            };
            return reportDB.updateReport( result[0]._id, report , onUpdateSuccess, onError );                
        }
    };
    function onError( err ){
        return next( err );
    };
    reportDB.getReportOfStatusOfFbId( req.session.fbId, "unsolved" , onGetSuccess, onError );    
});


router.get( '/all/status/:status', function( req, res, next){
    if( !chechRequest( req, res ) ) return;

    function onSuccess( result ){
        res.result = result;
        return response( req, res );
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfStatus( req.params.status, onSuccess, onError );    
});

router.get( '/all/period/:start/:end', function( req, res, next){
    if( !chechRequest( req, res ) ) return;

    function onSuccess( result ){
        res.result = result;
        return response( req, res );
    };
    function onError( err ){
        return next( err );
    }
    var timeStart = Number( req.params.start );
    var timeEnd = Number( req.params.end );
    reportDB.getReportOfPeriod( timeStart, timeEnd, onSuccess, onError );    
});

// To be implemented
router.get( '/all/:prop/:value', function( req, res, next){
    if( !chechRequest( req, res ) ) return;

    function onSuccess( result ){
        res.result = result;
        return response( req, res );
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfFbId( req.params.fbId , onSuccess, onError );    
});


router.post( '/id/:reportId', function( req, res, next ){
    if( !chechRequest( req, res ) ) return;

    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    }
    reportDB.updateReport( req.params.reportId, req.query , onSuccess, onError );    
});   


module.exports = router;
