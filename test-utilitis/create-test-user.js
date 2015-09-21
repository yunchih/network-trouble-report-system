var request = require('request');
var fbConfig = require('../config/fb-app.js');

var appId = fbConfig.appId;
var appSecret = fbConfig.appSecret;
var accessToken = appId + "|" + appSecret;

var counter = 100;

function create(){
    request.post( "https://graph.facebook.com/v2.4/" + appId + "/accounts/test-users",
                  { qs: { installed: true, access_token: accessToken } },
                  function( err, res, data){
                      console.log( data);
                      if( counter > 0 ){
                          counter -= 1;
                          process.nextTick(create);
                      }
                  }
                );                      
};


create();
