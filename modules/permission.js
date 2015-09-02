


module.exports = {

    request: function( config ){
        
        return function( req, res ){
            console.log( req.route );
            var path = req.route.path;
            var method = req.route.stack[0].method;
            var reqPermission = req.session.permission;

            // Filter query fields
            var query = {};
            var allowField = ( config.queryAllowField[path] || {} )[method];
            if( allowField ){
                var length = allowField.length;
                for( var i = 0 ; i < length ; ++i  ){
                    var key = allowField[i];
                    if( req.query[key] ){
                        query[key] = req.query[key];
                    }
                }
            }
            req.query = query;

            // Filter access
            var permissionConfig = config.permissionConfig;
            if( permissionConfig[reqPermission][method].indexOf( path ) === -1 ){
                res.json( { result: "permission deny" } );
                return false;
            }
            return true;
        };      
    },

    response: function( config ){
        return function( req, res ){
            var method = req.route.method;
            var reqPermission = req.session.permission;

            // Filter db return fields
            var resAllowField = config.resAllowField[reqPermission];
            var response = [];
            var result = res.result;
            if( resAllowField ){
                for( var i = 0 ; i < result.length ; ++i ){
                    response[i] = {};
                    var length = resAllowField.length;
                    for( var j = 0 ; j < length ; ++j ){
                        var prop = resAllowField[j];
                        response[i][prop] = result[i][prop];
                    }
                }
            }
            res.json( response );
        };
    }
    
};
