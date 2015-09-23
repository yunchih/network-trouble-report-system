var https = require('https');
var config = require('../config/recaptcha.js');
var request = require('request');

module.exports = {
    verify: function( response, callback ){
        try{
            request.get("https://www.google.com/recaptcha/api/siteverify?secret=" + config.secret +
                        "&response=" + response, function( err, status, data ){
                            try {
                                if( err !== null ){
                                    return console.log( err );
                                }
                                var parsedData = JSON.parse(data);                              
                                return callback(null, parsedData.success);
                            } catch (e) {
                                return callback(e, false);
                            }
                        });
        }
        catch( e ){
            callback( e, false );
        }
    }
};
