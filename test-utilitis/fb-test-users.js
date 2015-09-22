var request = require('request');
var fbConfig = require('../config/fb-app.js');

var appId = fbConfig.appId;
var appSecret = fbConfig.appSecret;
var accessToken = appId + "|" + appSecret;

var counter = 700;

function get( nUsers, done ){
    request.get( "https://graph.facebook.com/v2.4/" + appId + "/accounts/test-users",
                 { qs: { access_token: accessToken, limit: nUsers } },
                 function( err, res, data){
                     if( err !== null ){
                         console.log( "Error getting fb access tokens!!" );
                         process.abort();
                     }
                     var users = JSON.parse( data ).data;
                     debugger;
                     done( users );                     
                 }
               );                      
};


function create(){
    for( var i = 0 ; i < counter ; ++i ){
        request.post( "https://graph.facebook.com/v2.4/" + appId + "/accounts/test-users",
                      { qs: { access_token: accessToken, installed: true } },
                      function( err, res, data){
                          var users = JSON.parse( data ).data;
                          console.log( data );
                          //counter -= 1;
                          if( counter > 0 ){                         
                              //process.nextTick( create );
                          }
                      }
                    );
    }
};


module.exports = {
    create: create,
    get: get
};
    
