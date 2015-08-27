var reportDB = require('./modules/report-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/report.js' ).config;
var permission = require( '../modules/permission.js' );

router.use( permission.request( config ) );
            
router.get( '/current/:status', function( req, res, next){
    function onSuccess( result ){
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    var status = req.params.status;
        
    reportDB.getReportOfStatusOfFbId( req.session.fbId,  onSuccess, onError );    
});


router.get( '/current', function( req, res, next ){
    function onSuccess( result ){
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    };
    reportDB.getReportOfFbId( req.session.fbId, onSuccess, onError );
});

router.post( '/current', function( req, res, next ){
    function onGetSuccess( result ){
        if( !result ){
            function onAddSuccess( result ){
                return res.json( { result: "success" } );
            };
            return reportDB.addReport( req.query, onAddSuccess, onError );
        }else{
            function onUpdateSuccess( result ){
                return res.json( { result: "success" } );
            };
            var report = req.query;
            report.fbId = req.fbId;
            report.timestamp = Date.now();
            report.status = "unsolved";
            return reportDB.updateReport( result._id, req.query , onUpdateSuccess, onError );                
        }
    };
    function onError( err ){
        return next( err );
    };
    reportDB.getReportOfStatusOfFbId( req.session.fbId, "unsolved" , onGetSuccess, onError );    
});


router.get( '/all/status/:status', function( req, res, next){
    function onSuccess( result ){
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfStatus( req.params.status, onSuccess, onError );    
});

router.get( '/all/period/:start/:end', function( req, res, next){
    function onSuccess( result ){
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfPerid( req.params.start, req.params.end, onSuccess, onError );    
});


router.get( '/all/fb-id/:fbId', function( req, res, next){
    function onSuccess( result ){
        res.result = result;
        return next();
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfFbId( req.params.fbId , onSuccess, onError );    
});


router.post( '/id/:reportId', function( req, res, next ){
    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    }
    reportDB.updateReport( req.params.reportId, req.query , onSuccess, onError );    
});   

router.use( permission.response( config ) );

