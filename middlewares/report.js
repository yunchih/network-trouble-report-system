var reportDB = require('./modules/report-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/report.js' ).config;

router.use( function( req, res, next ){
    var query = {};
    var path = req.router.path;
    var method = req.router.method;
    var allowField = config.queryAllowField[path][method];
    for( var key of allowField ){
        query[key] = req.query[key];
    }
    req.query = query;
});

router.use( function( req, res, next ){
    var path = req.router.path;
    var method = req.router.method;
    
    var permissionConfig = config.permissionConfig;
    var reqPermission = req.session.permission;
    if( permissionConfig[reqPermission].method.indexOf( path ) === -1 ){
        res.json( { result: "permission deny" } );
    }else{
        next();
    }
});
        
router.get( '/current/:status', function( req, res, next){
    function onSuccess( result ){
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    }
    var status = req.params.status;
        
    reportDB.getReportOfStatusOfFbId( req.session.fbId, onSuccess, onError );    
});


router.get( '/current', function( req, res, next ){
    function onSuccess( result ){
        return res.send( result );
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
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfStatus( req.params.status, onSuccess, onError );    
});

router.get( '/all/period/:start/:end', function( req, res, next){
    function onSuccess( result ){
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    }
    reportDB.getReportOfPerid( req.params.start, req.params.end, onSuccess, onError );    
});


router.get( '/all/fb-id/:fbId', function( req, res, next){
    function onSuccess( result ){
        return res.send( result );
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


