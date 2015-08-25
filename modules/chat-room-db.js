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
    addMessage: function( message, onSuccess, onError ){
        function add( db ){
            var result = db.collection('messages').insert( message );
            return onSuccess( result );
        };
        init( add, onError );
    },

    getUnreadMessage: function( fbId, channel, onSuccess, onError ){
        function find( db ){
            var result = db.collection('message').find( { channel: channel, read: fbId } );
            return onSuccess( result );
        }
        init( find, onError );
    },
    
    getUnreadMessage: function( fbId, onSuccess, onError ){
        function find( db ){
            var query = {};
            query.to = fbId;
            query["read." + fbId ] = false;
            var result = db.collection("massages").find( query )
                .sort( { timestamp: 1} );
            return onSuccess( result );
        };
        init( find, onError );
    },

    setMessageRead: function( fbId, messageId, channel, onSuccess, onError ){
        function set( db ){
            var set = {};
            set["read." + fbId] = true;
            var result = db.collection("messages").update( { channel: channel, $lte: { _id: messageId } },
                                                           { $set: set },
                                                           { multi: true } );
            return onSuccess( result );
        };
        init( set, onError );
    },

    getBefore: function( messageId, channel, nMessage, onSuccess, onError ){
        function get( db ){
            var result = db.collection("messages")
                .find( { $lte: { _id: messageId }, channel: channel } )
                .limit(nMessage) ;
            return onSuccess( result );
        };
        init( get, onError );
    },

    getChannelRead: function( fbId, read, onSuccess, onError ){
        function get( db ){
            var query = {};
            query["read." + fbId] = read;
            var result = db.collection("messages" )
                .distinct( "channel", query );
        }
        init( get, onError );
    },

    getChannelOfUser: function( members, onSuccess, onError ){
        function get( db ){
            var result = db.collection("channel")
                .find( { member:{ $all: members } } );
            return onSuccess( result );
        };
        init( get, onError );
    },
    
    getChannel: function( channelId, onSuccess, onError ){
        function get( db ){
            var result = db.collection("channel")
                .find( { _id: channelId } );
            return onSuccess(result);            
        }
        init( get, onError );
    },

    
    newChannel: function( channel, onSuccess, onError ){
        function insert( db ){ 
            var result = db.collection("channel")
                .insert( channel );
            var review = db.collection("channel")
                .find( channel ).sort( { _id: -1 } ).limit( 1 );
            result.review = review;
            return onSuccess( result );
        }
        init( insert, onError );
    },

    findFbIdChannel: function( fbId, onSuccess, onError ){
        function find( db ){
            var result = db.collection( "channel" )
                .find( { member: fbId } );
            return onSuccess( result );
        }
        init( find, onError );
    }
};
