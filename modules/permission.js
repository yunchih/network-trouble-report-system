


module.exports = {

    request: function( config ){
        
        return function( req, res, next ){

            var path = req.router.path;
            var method = req.router.method;
            var reqPermission = req.session.permission;
            
            // Filter query fields
            var query = {};
            var allowField = config.queryAllowField[path][method];
            for( var key of allowField ){
                query[key] = req.query[key];
            }
            req.query = query;

            // Filter access
            var permissionConfig = config.permissionConfig;
            if( permissionConfig[reqPermission].method.indexOf( path ) === -1 ){
                return res.json( { result: "permission deny" } );
            }else{
                return next();
            }

        };      
    },

    response: function( config ){
        return function( req, res, next ){

            var method = req.router.method;
            var reqPermission = req.session.permission;

            // Filter db return fields
            var resAllowField = config.resAllowField[reqPermission];
            var response = {};
            var result = res.result;
            for( var prop of resAllowField ){
                response[prop] = result[prop];
            }
            res.json( response );
        };
    }
    
};
