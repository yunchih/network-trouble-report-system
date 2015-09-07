var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../config/jwt.js');

module.exports = function(){    
    var secret = crypto.randomBytes(config.keyLength, function(ex, buf) {
        if( ex ){
            console.log("Error generate random secret");
            return console.log( ex );
        }
        secret = buf;
        //console.log( secret.toString('base64') );
        return console.log("Succefully generate random secret");
    });

    return  {        
        encode: function( data ){
            var option = { algorithm: config.algorithm,
                           expiresInMinutes: config.expireTime };
            return jwt.sign( data, secret, option);
        },
        session: function( req, res, next ){
            if( !req.query.access_token ){
                req.session = {};
                return next();
            }
            var option = {
                algorithm: [config.algorithm]
            };
            return jwt.verify(req.query.access_token, secret, option, function(err, decoded) {
                if( err !== null ){
                    return next( err );
                }
                delete req.query.access_token;
                req.session = { fbId: decoded.fb_id,
                                permission: decoded.permission };
                return next();
            });
        },
        verify: function( req, res, next ){
            if( ! req.session.permission ){
                return res.json( {error: "Permission deny"} );
            }else{
                return next();
            }
        },
        renew: function( req, res, next ){
            var option = { algorithm: config.algorithm,
                           expiresInMinutes: config.expireTime };
            var access_token = jwt.sign( req.session, secret, option);
            return res.json( { access_token: access_token });
        }    
    };
};
