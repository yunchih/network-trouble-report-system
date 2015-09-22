var request = require('request');
var fs = require( "fs" );
var base = "http://127.0.0.1:8080/api/1.0/";
var fbTestUsers = require( './fb-test-users.js' );
var db = require("mongodb");
var dbConfig = require("../config/db.js");
function User(user){
    for( var prop in user ){
        this[prop] = user[prop];
    }
};


User.prototype.login = function( verify ){
    var user = this;
    request.post( base + "auth/login",
                  { qs:
                    {
                        fb_id: this.fb_id,
                        access_token: this.fb_access_token
                    }
                  }, function( err, res, data){
                      if( err !== null ){ console.log( "Error request login: ", err ); }
                      else{
                          data = JSON.parse( data );
                          console.log( "Login Result:====================" );
                          console.log( user );
                          console.log( data );
                          verify( res, data );
                          updateAccessToken( data.access_token );                                  
                      }
                  });

    function updateAccessToken( accessToken ){
        this.access_token = accessToken;
    };

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
                                access_token: this.access_token,
                                agree: true,
                                name: this.name,
                                room_number: this.room_number,
                                ip: this.ip,
                                validate_code: doc[0].validate_code
                            }
                          }, function( err, res, data){
                              if( err !== null ){ console.log( "Error request login: ", err ); }
                              else{
                                  data = JSON.parse( data );
                                  console.log( "Register Result:====================" );
                                  console.log( user );
                                  console.log( data );
                                  verify( res, data );
                              }
                          });
        });    

        
};


var nTest = 1;


db.connect( dbConfig.url, function( err, db ){
    if( err !== null ){
        console.log( "Error opening database!!" );
        process.abort();
    }
    fbTestUsers.get( nTest, test );

    function test( fbUsers ){
        var userData = JSON.parse( fs.readFileSync( "./data/users.json" ).toString() );
        var users = [];
        for( var i = 0 ; i < nTest ; ++i ){
            userData[i].fb_access_token = fbUsers[i].access_token;
            users.push( new User( userData[i] ) );

            if( fbUsers[i].id !== users[i].fb_id ){
                console.log( "Error: different fb id!!" );
                process.abort();
            }
        }


        var usersCollection = db.collection("users");
        for( user of users ){
            user.register( usersCollection, verifyRegister );
        }

                
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
            
            // if( data.register ){
            //     success = false;            
            //     console.log( "Wrong Login: reigstered" );
            // }
            if( success ){
                console.log( "Success Login" );
            }
        };


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
        };
            
    }


    function testLogin(){
        for( var user of users ){
            user.login( verifyLogin );
        }
    }
});
