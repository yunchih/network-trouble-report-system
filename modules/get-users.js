var cheerio = require("cheerio");
var iconv = require("iconv-lite");
iconv.extendNodeEncodings();
var request = require("request");

var url = "http://dorm.ntu.edu.tw/nms/start.php";

var getInput = function(hide, done) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    var input = '';
    function handler(char){
        char = String(char);
        switch (char) {
        case "\n": case "\r": case "\u0004":
            // They've finished typing their password
            process.stdin.setRawMode(false);
            process.stdout.write("\n");
            process.stdin.removeListener( "data", handler);
            return done( input );
            break;
        case "\u007F":
            if( input.length > 0 ){
                input = input.substr(0, input.length - 1 );
                //console.log( process.stdout.cursor ); 
                process.stdout.cursorTo(input.length);
                process.stdout.write(" ");
                process.stdout.cursorTo(input.length);
            }
            break;
        default:
            input += char;
            if( hide ){
                process.stdout.write("*");
            }else{
                process.stdout.write(char);
            }
            break;                
        }
    };
    process.stdin.on("data", handler);
};

getAccount();


var account;
var password;


function getAccount(){
    process.stdout.write("Account:\n");
    getInput( false, function(input){
        account = input;
        getPassword();
    });
};
function getPassword(){
    process.stdout.write("Password:\n");
    getInput( true, function(input){
        password = input;
        getUsers();
    });
};


function getUsers(){

    var jar = request.jar();

    request.get( url, {  encoding: "big5",
                         followAllRedirects: true,
                         jar: jar }, login );

    
    function login(err, res, data){
        if( err ) throw err;
        console.log( "Cookie: " + jar.getCookieString(url) );
        request.post( url, { form:
                             {
                                 login_name: "m1.ntu.edu.tw",
                                 passwd: password
                             },
                             encoding: "big5",
                             followAllRedirects: true,
                             jar: jar
                           }, onLogin );
    };
    
    function onLogin( err, res, data){
        console.log( "Cookie: " + jar.getCookieString(url) );
        console.log("login success");
        request.post("http://dorm.ntu.edu.tw/nms/ip_mac_display.php"
                     ,{
                         form: {
                             rowsPerPage:"1000"
                         },
                         encoding: "big5",
                         followAllRedirects: true,
                         jar: jar
                     }, parse );
    }

    function parse( err, res, data){
        console.log( "Cookie: " + jar.getCookieString(url) );

        var $ = cheerio.load( data );       
        var trs = $("table").last().children();
        var nTrs = trs.length;
        console.log( nTrs );
        var users = [];
        for( var i = 1 ; i < nTrs ; ++i ){
            var tds = $(trs[i]).children();
            var row = [];
            tds.each( function( ind, ele ){
                row.push( $(this).text().toUpperCase() );
            });
            users.push( { student_id: row[4] } );
        }
        console.log( JSON.stringify(users) );
        console.log("end");
    };

};
    


