var request = require('request');
var fs = require( "fs" );
var fbTestUsers = require( './fb-test-users.js' );
var db = require("mongodb");
var dbConfig = require("../config/db.js");

function User(user){
    for( var prop in user ){
        this[prop] = user[prop];
    }
};

var base = "http://127.0.0.1:8080/api/1.0/";

var recaptcha = "03AHJ_VusfwEwFJVpHtYl_-41wi3xnGxO5dFWRRuKrybY7NRcaQI1ww7XqtDC-GtxaQ8KWRBuEn2PJ0aAGLgkN9e5Zl6XdDKugGLTzU7ooCmTW85-TMELaV6rGfkXYJtV498f5TbRprnxPMQEsclQTtCg1uky151uF6_FeksFS084j229FmZaKcgeDGn-WxjMsHNIAMWsXvZU9IwT0nLczGjXuCB8m3QApookbL0iZBdV6e6V7HxHJO-W8yLlSNnPFjvxoN49_hCBXLY2yHiiC0MAvmhEpQH0MqQlmRJ94utfbkCWV9k4vDWy1Pj1Cto2OHhMZmLeOntUW5p4xgnHVqfv7ywHRVfRjfvVSj4QLokTuHfO95MZbLjwK-fIwAnxiPrV7V2FzyCLg890zHwd40dfOK2ZZNy_JdX9IvtOvezDJkVAkwulKUUhCuCg0JyXpJjRgGOTxo4lgAkllqRvtX_jmSj1CaKWa1fi7N4KbRsQZDQqYQZp5eJqnSXGlgoJ0ySmJ-pLbzpKEGh6Bu1dwA14lj8Lf9-2xUQsypwmUqeUKQzaDe336ww2c9YBjTkwP6wexwiNsYqvpDBpGvTdBmxjFTlJQgKgXm8SLomfb7nWRivleoQSiF_vA6kktpG6KjxrULpkdfqX-P4HN1g1KoOjsb739zBOYjaMSFRPjA6YtHkRtxYCMu2B70xtSENsta-N2y4p3sR4O9eZqthdmFmfcXxIafnQksSSX__WuMge3s_VE8Irwhxo";

User.prototype.login = function( verify ){
    var user = this;
    request.post( base + "auth/login",
                  { qs:
                    {
                        fb_id: this.fb_id,
                        access_token: this.fb_access_token
                    }
                  }, function( err, res, data){
                      if( err !== null ){
                          console.log( "Error request login: ", err );
                          process.nextTick( function(){
                              user.login(verify);
                          });
                      }
                      else{
                          data = JSON.parse( data );
                          console.log( "Login Result:====================" );
                          console.log( user );
                          console.log( data );
                          user.access_token = data.access_token;                          
                          verify( res, data );
                      }
                  });


};

User.prototype.register = function( usersCollection, verify ){
    var user = this;
    usersCollection.find( { student_id: this.student_id } )
        .toArray( function( err, doc ){
            if( err ){
                console.log( "Error opening database!!" );
                process.abort();
            }
            if( doc.length > 1 ){
                console.log( "Dupicate user with the same student_id found!!" );
                process.abort();
            }

            request.post( base + "register",
                          { qs:
                            {
                                student_id: user.student_id,
                                access_token: user.access_token,
                                agree: true,
                                name: user.name,
                                room_number: user.room_number,
                                ip: user.ip,
                                validate_code: doc[0].validate_code,
                                recaptcha: recaptcha
                            }
                          }, function( err, res, data){
                              if( err !== null ){
                                  console.log( "Error request login: ", err );
                                  process.nextTick( function(){ user.register( usersCollection, verify ); } );
                              }
                              else{
                                  data = JSON.parse( data );
                                  console.log( "Register Result:====================" );
                                  console.log( user );
                                  console.log( data );
                                  user.access_token = data.access_token || user.access_token;                          
                                  verify( res, data );
                              }
                          });
        });    

        
};


var nTests = 800;


db.connect( dbConfig.url, function( err, db ){
    if( err !== null ){
        console.log( "Error opening database!!" );
        process.abort();
    }    

    // Main!!
    (function(){
        var todoList = [ testLogin, testRegister ];
        var ind = 0;
        init( next );
        function next(){
            if( ind < todoList.length ){
                process.nextTick(function(){
                    console.log( "Executing process: ", ind );                        
                    todoList[ind++](next);
                });
            }else{
                console.log( "Process end!!" );
                process.exit(0);
            }
        }
    })();
            
    var users = [];
    function init( next ){
        fbTestUsers.get( nTests, function( fbUsers ){
            var userData = JSON.parse( fs.readFileSync( "./data/users.json" ).toString() );
            for( var i = 0 ; i < nTests ; ++i ){
                userData[i].fb_access_token = fbUsers[i].access_token;
                users.push( new User( userData[i] ) );

                if( fbUsers[i].id !== users[i].fb_id ){
                    console.log( "Error: different fb id!!" );
                    process.abort();
                }
            }
            next();
        });
    }        
    
    function testRegister( next ){
        var usersCollection = db.collection("users");
        for( var user of users ){
            user.register( usersCollection, verifyRegister );
        }

        var counter = 0;
        
        function verifyRegister( res, data ){
            var success = true;
            if( res.statusCode !== 200 ){
                success = false;
                console.log( "Wrong Login: status" , res.statusCode );
            }
            if( data.success !== true ){
                success = false;
                console.log( "Wrong Register: not succeess" );
            }
            if( ++counter === nTests ){
                next();
            }
        };
        
    }


    function testLogin( next ){
        console.log( "Start test login!!" );
        for( var user of users ){
            user.login( verifyLogin );
        }
        var counter = 0;
        function verifyLogin( res, data ){
            var success = true;
            if( res.statusCode !== 200 ){
                success = false;
                console.log( "Wrong Login: status" , res.statusCode );
            }
            if( data.success !== true ){
                success = false;
                console.log( "Wrong Login: not succeess" );
            }
            if( data.error ){
                success = false;
                console.log( "Wrong Login: Error ", data.error );
            }
            //console.log( "Access token = ", users[0] );
            // if( data.register ){
            //     success = false;            
            //     console.log( "Wrong Login: reigstered" );
            // }
            if( success ){
                console.log( "Success Login" );
            }

            if( ++counter === nTests ){
                next();
            }
        };

        
    }
});
