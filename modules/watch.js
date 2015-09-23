var cheerio = require("cheerio");
var iconv = require("iconv-lite");
iconv.extendNodeEncodings();
var request = require("request");
var CronJob = require('cron').CronJob;

var url = "http://cert.ntu.edu.tw/Module/Index/ip.php";
// var url = "http://localhost:8080/test";
var subnets = [ "240", "241", "242", "196", "239", "199" ];

module.exports = function( userCollection ){

    check();
    
    var job = new CronJob({
        cronTime: '*/20 * * * * *',
        onTick: check,
        start: true
    });

    function check(){

        var nUnparsed = subnets.length;
        
        for( var i = 0 ; i < subnets.length ; ++i ){
            request.post( url, { form:
                                 {
                                     isset: "ok",
                                     ip1: "140",
                                     ip2: "112",
                                     ip3: subnets[i],
                                     ip4: ""
                                 },
                                 encoding: "big5"
                               }, parseCC );
        }

        var blocked = [];
        
        function parseCC( err, res, body ){
            if( err !== null ){
                console.log( "ERROR POST " + url );
                return;
            }
            var $ = cheerio.load( body );
            var tables = $("table");
            if( tables.length == 3 ){
                var trs = tables.eq(1).children();
                var nTrs = trs.length;
                for( var i = 1 ; i < nTrs ; ++i ){
                    var tds = $(trs[i]).children();
                    var row = [];
                    tds.each( function( ind, ele ){
                        row.push( $(this).text() );
                    });
                    blocked.push( row );
                }
            }

            nUnparsed -= 1;
            if( nUnparsed === 0 ){
                update();
            }
        };
        
        function update(){
            console.log( blocked );
            userCollection
                .find( {blocked: true} )
                .toArray( function( err, previousBlocked ){
                    var unblocked = [];
                    if( err !== null ){
                        console.log( (new Date) + "Error" + err );
                    }else{
                        var len = previousBlocked.length;

                        // Remove those who have been blocked from the set of
                        // previous blocked list and new blocked list.
                        // ( remove the interset )
                        for( var i = 0 ; i < len ; ++i ){
                            var exist = blocked.indexOf( previousBlocked[i].ip );
                            if( exist !== -1 ){
                                previousBlocked.splice( i, 1 );
                                blocked.splice( exist, 1 );
                            }
                        }

                        // Then the newer blocked list = the ips which is newly blocked
                        console.log( "Newly blocked: " + blocked );

                        // And the old block list = the ips which is unblocked recently
                        console.log( "Newly unblocked: " + previousBlocked );
                        
                    }
                });
            
            console.log( (new Date()) + "Finish updating users blocked." );
        }
    };

};

        




        
        // function parse197(data){
        //     try{
        //         var $ = cheerio.load( data );
        //         var trs = $("table").last().children();
        //         var blocked = [];
        //         trs.each( function( ind, tr) {
        //             var tds = $(this).children();
        //             var row = [];
        //             tds.each( function( ind, td ){            
        //                 row.push( $(this).text() );
        //             } );
        //             blocked.push( row );
        //         } );
        //     }catch(err){
        //         console.log( "Error: watch fail to parse " + url );
        //         console.log( err );
        //     }
        //     console.log( blocked );
        // };
