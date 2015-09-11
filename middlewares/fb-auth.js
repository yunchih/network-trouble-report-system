var fbConfig = require('../config/fb-app.js');
var querystring = require('querystring');
var https = require('https');
var express = require('express');
var router = express.Router();


module.exports = function( userCollection, auth ){

    router.post( '/login', function( req, res, next ){
        var reqFbId = req.query.fb_id;
        var token = req.query.access_token;
        var appSecret = fbConfig.appId + "|" + fbConfig.appSecret;
        var data = "";

        // Call FB API to check access token
        https.get( "https://graph.facebook.com/debug_token?input_token=" + token +
                   "&access_token=" + appSecret, function( res ){
                       res.on( "data", function(chunk){
                           chunk = chunk || "";
                           data += chunk.toString();
                       });                       
                       return res.on( 'end', validate );
                   }).on( 'error', function( err ){
                       return next( err );
                   });
        
        function validate(){
            
            var fbRes = JSON.parse(data);
            if( fbRes.error ){
                return next( Error( fbRes.error ) );
            }
            var tokenData = fbRes.data;
            var now = Date.now();
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

    
                 
