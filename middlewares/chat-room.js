// TODO: How to access as nma ?


var chatRoomDB = require('./modules/char-room-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/chat-room.js' ).config;

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

router.use( function( req, res, next ){
    var chatRoomId = req.session.chatRoomId || req.session.fbId ;
    req.chatRoomId = chatRoomId;
    return next();
});

// Filter invalid access to message and add channel information to req.
router.use( function( req, res, next){
    var channelId = req.params.channel || req.query.channel ;

    
    if( channelId ){
        function onSuccess( channel ){
            if( channel.indexOf( req.chatRoomId ) === -1){
                return res.json( { result: "invalid operation: access others'  message" } );
            }else{
                req.channel = channel;
                return next();
            }
        };
        function onError( err ){
            next( err );
        };
        chatRoomDB.getChannel( channelId, onSuccess, onError );
    }
    else{
        next();
    }
});
            
// get /channels
// get /channels/:status
// get /channel/:channel/message/unread
// get /channel/:channel/massage/before/:messageId
// get /channel/:channel/members
// post /channel/new
// post /channel/new/nma
// post /channel/:channel/message
// post /channel/:channel/new/user
// post /channel/:channel/message/:message

router.get( '/channels', function( req, res, next){
    function onSuccess( result ){
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    }
    chatRoomDB.getChannelsOfUser( [req.chatRoomId], onSuccess, onError );    
});

router.get( '/channels/:status', function( req, res, next){
    function onSuccess( result ){
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    };
    var status = req.params.status;
    if( status === 'read' ){
        return chatRoomDB.getChannelsRead( req.chatRoomId, true, status, onSuccess, onError );
    }
    else if( status === 'unread' ){
        return chatRoomDB.getChannelsRead( req.chatRoomId, false, status, onSuccess, onError );
    }
    else{
        return res.json( { result: "invalid status" } );
    }
});

            

router.get( '/channel/:channel/message/unread', function( req, res, next){
    function onSuccess( result ){
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    };
    var channel = req.params.channel;
    chatRoomDB.getMessageUnread( req.chatRoomId, channel, onSuccess, onError );
});

router.get( '/channel/:channel/message/before/:messageId', function( req, res, next ){
    function onSuccess( result ){
        return res.send( result );
    };
    function onError( err ){
        return next( err );
    };
    chatRoomDB.getMassageBefore( req.params.messageId, req.params.channel,
                                 config.getMessageNumber,
                                 onSuccess, onError );    
});

router.get( '/channel/:channel/members', function( req, res, next){
    function onSuccess( channel ){
        return res.send( channel.members );
    };
    function onError( err ){
        return next( err );
    }
    chatRoomDB.getChannel( req.params.channel, onSuccess, onError );    
});

router.post( '/channel/new', function( req, res, next ){
    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    }
    chatRoomDB.addChannel( req.query, onSuccess, onError );    
});   

router.post( '/channel/new/nma', function( req, res, next ){
    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    }
    //var channel = req.query;
    var channel = {};    
    channel.members = [ req.chatRoomId, "nma" ];    
    chatRoomDB.updateReport( channel, onSuccess, onError );    
});   

router.post( '/channel/:channel/message', function( req, res, next ){
    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    };
    
    var message = req.query;
    message.timestamp = Date.now();
    message.read = [];      

    for( var member of req.channel.members ){
        message.read[member] = false;
    }
    message.read[ req.chatRoomId ] = true;
    chatRoomDB.addMessage( message, onSuccess, onError );
});


router.post( '/channel/:channel/new/member/:fbId', function( req, res, next ){
    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    };
    chatRoomDB.addChannelMember( req.params.channel, req.params.fbId,
                                 onSuccess, onError );
});

router.post( '/channel/:channel/message/:message/read', function( req, res, next ){
    function onSuccess( result ){
        return res.json( { result: "success" } );
    };
    function onError( err ){
        return next( err );
    };
    chatRoomDB.setMessageRead( req.params.message, onSuccess, onError );
});

router.post( '/alias/nma', function( req, res, next ){
    req.session.chatRoomId = 'nma';
    res.json( { resut: 'success' } );
});
