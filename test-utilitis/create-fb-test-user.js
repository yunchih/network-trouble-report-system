var request = require('request');
var fbConfig = require('../config/fb-app.js');

var appId = fbConfig.appId;
var appSecret = fbConfig.appSecret;
var accessToken = appId + "|" + appSecret;

var counter = 700;

function get(){
    request.get( "https://graph.facebook.com/v2.4/" + appId + "/accounts/test-users",
                 { qs: { access_token: accessToken, limit: 2000 } },
                 function( err, res, data){
                     var users = JSON.parse( data ).data;
                     var ids = [];
                     for( var user of users ){
                         ids.push( user.id );
                     }
                     console.log( JSON.stringify(ids) );
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


get();

//create();
