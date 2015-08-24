var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbConfig = require('../config/db.js');

var init = function ( onConnected, onError ){
        // Initialization
    dbConfig.urlurl = 'mongodb://localhost:27017';
    MongoClient.connect( dbConfig.url, function(err, db) {
        if( err !== null ){
            return onError( err );
        }
        console.log("Connected correctly to server.");            
        return onConnected( db );
    });
};

module.export = {
    addReport: function( report, onSuccess, onError ){
        function add( db ){
            var result = db.collection('report').insert( report );
            return onSuccess( result );
        };
        init( add, onError );
    },

    getReportOfStatusOfFbId: function( fbId, status, onSuccess, onError ){
        function find( db ){
            var result = db.collection("report").find( { fbId: fbId, status: status } );
            return onSuccess( result );
        };
        init( find, onError );
    },

    getReportOfFbId: function( fbId, onSuccess, onError ){
        function find( db ){
            var result = db.collection("report").find( { fbId: fbId } );
            return onSuccess( result );
        };
        init( find, onError );
    },
    
    updateReport: function( reportId, report, onSuccess, onError ){
        function set( db ){
            var result = db.collection("messages").update( { _id: reportId }, { $set: report } );
            return onSuccess( result );
        };
        init( set, onError );
    },

    getReportOfStatus: function( status, onSuccess, onError ){
        function find( db ){
            var result = db.collection("message").find( { status: status } );
            return onSuccess( result );
        };
        init( find, onError );
    },

    getReportOfPeriod: function( timeStart, timeEnd, onSuccess, onError ){
        function find( db ){
            var result = db.collection("message")
                .find( { timestamp:
                         { $gte: timeStart,
                           $lt: timeEnd }
                       } );
            return onSuccess( result );
        };
        init( find, onError );
    }
};
