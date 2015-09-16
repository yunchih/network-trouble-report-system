var MongoClient = require('mongodb').MongoClient;
var dbConfig = require('../config/db.js');
    
function handle( db, onSuccess, onError ){
    return function(err, result){
        db.close();
        if( err !== null ){
            onError( err );
        }else{
            onSuccess( result );
        }
    };
};    

module.exports = {
    init: function( onConnect ){
        // Initialization
        MongoClient.connect( dbConfig.url, function(err, db) {
            if( err !== null ){            
                return console.log("Error connect to db!!");
            }
            console.log((new Date()) + "Database connect successfully.");
            return onConnect( db );
        });
    }
};
    
