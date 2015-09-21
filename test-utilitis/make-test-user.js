// This script must run under node with version >= 0.12
var fs = require("fs");

(function(){

    if( process.argv.length !== 3 ){
        console.log( "Usage: node make-test-user.js number-of-users" );
        process.exit();
    }

    var nUsers = Number(process.argv[2]);

    var fbIds = JSON.parse( fs.readFileSync( './data/fb-ids.json' ).toString() );
    var names = JSON.parse( fs.readFileSync( './data/names.json' ).toString() );
    var ids = generateStudentIds( nUsers );
    var ipsF12 = generateIPs( Math.floor( nUsers / 2) + 1 );
    var ipsF34 = generateIPs( Math.floor( nUsers / 2) + 1 );
    var roomNumbers = generateRoomNumbers();
    var studentIds = generateStudentIds();

    var users = [];

    for( var i = 0 ; i < nUsers ; ++i ){

        var randInd = Math.floor( Math.random() * roomNumbers.length );
        var roomNumber = roomNumbers[randInd];
        roomNumbers.splice( randInd, 1 );
        var ip = roomNumber <= 2 ? ipsF12.pop() : ipsF34.pop();
        var user = {
            name: names[i],
            student_id: studentIds[i],
            id: ids[i],
            room_number: roomNumber,
            ip: ip,
            fb_id: fbIds[i]
        };
        console.log( user );
        users.push( user );        
    }

    console.log( JSON.stringify( users ) );

})();    

function generateStudentIds( n ){
    var base = "B99";
    var codes = "123456789ABHJKQZ";
    var set = new Set();
    while( set.length < n ){
        var codeInd = Math.floor( Math.random() * 1000 ) % codes.length;
        var code = codes[codeInd];
        var rand5 = Math.floor( Math.random() * 100000 );
        var id = base + code + rand5 ;
        set.add( id );
    }

    var ids = [];

    for( var id of set.values() ){
        ids.push( id );
    }
    return ids;
};

    
function generateIPs( floor ){
    var base = "140.112";
    var subnet;
    if( floor <= 2 ){
        subnet = ["196", "239", "199" ];
    }else{
        subnet = ["240", "241", "242" ];
    }
        
    var ips = [];

    for( var i = 0 ; i < subnet.length ; ++i ){
        for( var j = 1 ; j < 256 ; ++j ){
            var ip = base + "." + subnet[i] + "." + j;
            ips.push( ip );
        }
    }

    return ips;
}


function generateRoomNumbers(){
    var numbers = [];
    var bedCodes = "ABCD";
    for( var i = 1 ; i <= 4 ; ++i ){
        var floor = [];
        for( var j = 1; j <= 62 ; ++j ){
            for( var k = 0 ; k < 4 ; ++k ){
                var number = String( i );
                if( j < 10 ){
                    number += "0";
                }
                number += j;
                number += bedCodes[k];
                numbers.push( number );
            }
        }
        //numbers.push( floor );
    }

    return numbers;
}
