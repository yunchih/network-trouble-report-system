var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbConfig = require('../config/db.js');
var ObjectId = require('mongodb').ObjectId;


var init = function ( onError, onConnect ){
    // Initialization
    MongoClient.connect( dbConfig.url, function(err, db) {
        if( err !== null ){            
            return onError( err );
        }
        return onConnect( db );
    });
};
    

function handle( db, onSuccess, onError ){
    return function(err, result){
        db.close();
        if( err !== null ){
            onError( err );
        }else{
            onSuccess( result );
        }
    };
};    

module.exports = {
    addReport: function( report, onSuccess, onError ){
        function onConnect( db ){
            db.collection('report')
                .insertOne( report, handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    getReportOfStatusOfFbId: function( fbId, status, onSuccess, onError ){
        function onConnect( db ){
            db.collection("report")
                .find( { fbId: fbId, status: status } )
                .toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    getReportOfFbId: function( fbId, onSuccess, onError ){
        function onConnect( db ){
            db.collection("report")
                .find( { fbId: fbId } )
                .toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },
    
    updateReport: function( reportId, report, onSuccess, onError ){
        function onConnect( db ){
            db.collection("report")
                .update( { _id: new ObjectId( reportId ) }, { $set: report },
                         handle( db, onSuccess, onError ) );
        };
        if( !ObjectId.isValid( reportId ) ){
            return onError( Error( "Invlid report id " ) );
        }
        return init( onError, onConnect );
    },

    getReportOfStatus: function( status, onSuccess, onError ){
        function onConnect( db ){
            db.collection("report")
                .find( { status: status } )
                .toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    getReportOfPeriod: function( timeStart, timeEnd, onSuccess, onError ){
        function onConnect( db ){
            var result = db.collection("report")
                .find( { timestamp:
                         { $gte: timeStart,
                           $lt: timeEnd }
                       } )
                .toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    }
};
