var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbConfig = require('../config/db.js');

var init = function ( onError, onConnect ){
    // Initialization
    dbConfig.urlurl = 'mongodb://localhost:27017';
    MongoClient.connect( dbConfig.url, function(err, db) {
        if( err !== null ){            
            return onError( err );
        }
        return onConnect( db );
    });
};

function handle( onSuccess, onError ){
    return function(err, result){
        if( ! err ){
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
                .insertOne( user, handle( onSuccess, onError) );
            db.close();
        };
        init( onError, onConnect );
    },

    deleteUserByFBId: function( fbId, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .remove( { "fb-id": fbId }, handle( onSuccess, onError ) );
            db.close();
        };
        init( onError, onConnect );
     },

    findUserByFBId: function( fbId, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .find( { "fb-id": fbId } )
                .toArray( handle( onSuccess, onError ) );
            db.close();
        };
        init( onError, onConnect );
    },
            
    updateUserByFBId: function( fbId, user, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .update( { "fb-id": fbId }, { $set: user }, handle( onSuccess, onError ) );
            db.close();
        };
        init( onError, onConnect );
    },

    findUser: function( property, value, onSuccess, onError ){
        var query = {};
        query[property] = value;
        var onConnect = function( db ){
            db.collection('users')
                .find( query )
                .toArray( handle( onSuccess, onError ) );
        };
        init( onError, onConnect );
    },

    updateUser: function( property, value, user, onSuccess, onError ){
        var query = {};
        query[property] = value;
        var onConnect = function( db ){
            db.collection('users')
                .update( query, { $set: user }, handle( onSuccess, onError ) );
            db.close( db );
        };
        init( onError, onConnect );
    },

    findUserByQuery: function( query, onSuccess, onError){
        var onConnect = function( db ){
            db.collection('users')
                .find( query ).toArray( handle( onSuccess, onError ) );
            db.close( db );
        };
        init( onError, onConnect );
    },

    updateUserByQuery: function( query, user, onSuccess, onError ){
        var onConnect = function( db ){
            db.collection('users')
                .update( query, { $set: user }, handle( onSuccess, onError ) );
            db.close( db );
        };
        init( onError, onConnect );
    }
            
};

    
