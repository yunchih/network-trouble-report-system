var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbConfig = require('../config/db.js');

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

    addUser: function( user, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .insertOne( user, handle( db, onSuccess, onError) );
        };
        init( onError, onConnect );
    },

    deleteUserByFBId: function( fbId, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .remove( { "fbId": fbId }, handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
     },

    findUserByFBId: function( fbId, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .find( { "fbId": fbId } )
                .toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },
            
    updateUserByFBId: function( fbId, user, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .update( { "fbId": fbId }, { $set: user }, handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    findUser: function( property, value, onSuccess, onError ){
        var query = {};
        query[property] = value;
        var onConnect = function( db ){
            db.collection('users')
                .find( query )
                .toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    updateUser: function( property, value, user, onSuccess, onError ){
        var query = {};
        query[property] = value;
        var onConnect = function( db ){
            db.collection('users')
                .update( query, { $set: user }, handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    findUserByQuery: function( query, onSuccess, onError){
        var onConnect = function( db ){
            db.collection('users')
                .find( query ).toArray( handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    updateUserByQuery: function( query, user, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .update( query, { $set: user }, handle( db, onSuccess, onError ) );
        };
        init( onError, onConnect );
    }
            
};

    
