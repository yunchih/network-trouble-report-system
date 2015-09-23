var fbConfig = require('../config/fb-app.js');
var querystring = require('querystring');
var https = require('https');
var express = require('express');
var router = express.Router();
var request = require( "request" );

module.exports = function( userCollection, auth ){

    router.post( '/login', function( req, res, next ){
        var reqFbId = req.query.fb_id;
        var token = req.query.access_token;
        var appSecret = fbConfig.appId + "|" + fbConfig.appSecret;

        // Call FB API to check access token
        request.get( "https://graph.facebook.com/debug_token?input_token=" + token +
                     "&access_token=" + appSecret, function( err, status, data ){
                         if( err !== null ){
                             return console.log( err );
                         }                         
                         return validate(data);
                     });
        
        function validate(data){
            
            var fbRes = JSON.parse(data);
            if( fbRes.error ){
                return next( Error( fbRes.error.toString() ) );
            }
            var tokenData = fbRes.data;
            var now = Date.now();
            if( tokenData.error ){
                return res.status(401).json( { error: "Invalid token." } );
            }
            if( tokenData.expire_at > now ){
                return res.json( { error: "Facebook token expired." } );
            }
            if( tokenData.app_id !== fbConfig.appId ){
                return res.json( { error: "token of other App" } );
            }
            if( tokenData.is_valid !== true ){
                return res.json( { error: "invalid token" } );
            }
            if( tokenData.user_id !== reqFbId ){
                return res.json( { error: "token of other user" } );
            }

            return userCollection.find( { fb_id: reqFbId } )
                .toArray( function( err, result ){
                    if( err !== null ){
                        return next( err );
                    }
                    var permission;
                    var registered;
                    if( result.length === 0 ){
                        permission = "nobody";
                        registered = false;
                    }else{
                        permission = result[0].permission;
                        registered = true;
                    }
                    var access_token = auth.encode( {
                        fb_id: reqFbId,
                        permission: permission
                    });
                    return res.json({
                        success: true,
                        registered: registered,
                        access_token: access_token
                    });
                });

        };

        
    });

    return router;
};

    
                 
