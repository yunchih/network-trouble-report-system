var express = require('express');
var router = express.Router();
var dbConfig = require( '../config/db.js' );
var MongoClient = require('mongodb').MongoClient;

router.use( function( req, res, next ){
    //req.query.test = true;    
    next();
});

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

router.get( "/post", function( req, res, next ){
    console.log( "post" );
    function add( db ){
        function onFinish( err, result ){
            res.send( result );
            console.log( result );
        };            
        var result = db.collection("test").insertOne( { test: "test", fbId: req.session.fbId }, onFinish );
    };
    init( add );
});


router.get( "/", function( req, res, next ){
    console.log('get' );
    function get( db ){
        function onSuccess( err, result ){
            res.send( req.session );
            //res.send( result );
            console.log( result );
        };            

        var cursor= db.collection("test").find( {  } );
        cursor.toArray( onSuccess );
    };
    init( get );
});

router.use( function( req, res ){
    return res.send( "OK" );
});

module.exports = router;
