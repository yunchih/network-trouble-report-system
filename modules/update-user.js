var database = require('./modules/db.js');


database.init(function(){
    var userCollection = db.collection('users');
    var bulk = userCollection.initializeOrderedBulkOp();
    var newData;
    var length = newData.length;
    for( var i = 0 ; i < length ; ++i ){
        (function( data ){
            bulk.find( { stdudent_id: data.student_id,
                         fb_id: { exist: true } } )
                .update( { $set:
                           {
                               ip: data.ip,
                               mac: data.mac
                           }
                         } );
        })(newData[i]);
    }

    bulk.execute(function(err, result) {
        if( err !== null ){
            console.log( "ERROR updating database." );
            return -1;
        }
        console.log( result );
        return 0;
    });

});
