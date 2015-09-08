var userDB = require('../modules/user-db.js');
var express = require('express');
var router = express.Router();
var config = require( '../config/register.js' );
var checkRequest = require( '../modules/permission.js' ).request( config );
// var response = require( '../modules/permission.js' ).response( config );
var email = require('../modules/email.js');
var recaptcha = require('../modules/recaptcha.js');

module.exports = function( userCollection, auth ){


    router.use(function( req, res, next){
        if( !req.query.student_id ){
            return res.json( { error: "student_id can not be empty." } );
        }
        userCollection.find( {student_id: req.query.student_id} )
            .toArray( function( err, result ){
                if( err !== null ){
                    return next( err );
                }
                if( result.length === 0 ){
                    return res.json( {error: "student_id not belong to the drom"} );
                }
                if( result[0].fb_id ){
                    return res.json( {error: "The student ID has been registered."} );
                }
                return recaptcha.verify( req.query.recaptcha, function( err, success ){
                    if( err !== null ){
                        return next(err);
                    }
                    if( !success ){
                        return res.json({error:"Invalid captcha response."});
                    }                    
                    req.validationCode = result[0].validate_code;
                    return next();
                });
            });
    });
    
    router.post( '/', function( req, res, next ){
        if( !checkRequest( req, res ) ){
            return false;
        }

        if( req.query.agree !== "true" ){
            return res.json( {error: "User must agree with term of service before registration"} ); 
        }

        delete req.query.agree;
        
        if( req.query.validate_code !== req.validationCode ){
            return res.json( { error: "Validation code incorrect!"} );
        }
        delete req.query.validate_code;

        var user = req.query;
        user.fb_id = req.session.fbId;
        user.permission = "general";
        
        return userCollection.update( { student_id: req.query.student_id },
                                      { $set: user, $unset: {validate_code: ""} }, function(err, result){
                                          if( err !== null ){
                                              return next( err );
                                          }
                                          var accessToken = auth.encode( {
                                              fb_id: user.id,
                                              permission: user.permission
                                          } );
                                          res.send( {
                                              success: true,
                                              access_token: accessToken
                                          } );
                                      }); 
    });
        
    router.post( '/mail', function( req, res, next){
        if( !checkRequest( req, res ) ){
            return false;
        }

        email.send( req.query.student_id + "@ntu.edu.tw",
                   "Dorm network registeration validation code.",
                   "Your validation code is:" + req.validationCode +
                   "\n Please don't reply to this email."
                  );
        return res.json( { success: true} );
    });
    
    return router;
};
