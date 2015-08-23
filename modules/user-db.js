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

    addUser: function( user, onSuccess, onError ){
        function add( db ){
            var result = db.collection('users').insert( user );
            return onSuccess( result);
        };
        init( add, onError );
    },

    deleteUserByFBId: function( fbId, onSuccess, onError ){
        function del( db ){
            var result = db.collection('users').remove( { "fb-id": fbId } );
            return onSuccess( fbId );
        };
        init( del, onError );
    },

    findUserByFBId: function( fbId, onSuccess, onError ){
        function find( db ){
            var result = db.collection('user').find( { "fb-id": fbId } );
            return onSuccess( result );
        };
        init( find, onError );
    },

            
    updateUserByFBId: function( fbId, user, onSuccess, onError ){
        function update( db ){
            var result = db.collection('user').
                update( { "fb-id": fbId }, { $set: user } );
            return onSuccess( result );
        }
        init( update, onError );
    },

    findUser: function( property, value, onSuccess, onError ){
        function find( db ){
            var query = {};
            query[property] = value;
            var result = db.collection('user').find( query );
            return onSuccess( result );
        }
        init( find, onError );
    },

    updateUser: function( property, value, user, onSuccess, onError ){
        function update( db ){
            var query = {};
            query[property] = value;
            var result = db.collection('user').update( { query }, { $set: user });
            return onSuccess( result );
        }
        init( update, onError );
    },

    findUserByQuery: function( query, onSuccess, onError){
        function find( db ){
            var result = db.collection('user').find( query );
            return onSuccess( result );
        }
        init( find, onError );
    },

    updateUserByQuery: function( query, user, onSuccess, onError ){
        function find( db ){
            var result = db.collection('user').update( query, { $set: user } );
            return onSuccess( result );
        }
        init( find, onError );
    }
            
};

    
