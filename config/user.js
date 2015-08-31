var userProperty = [
    '_id',
    'name',
    'roomNumber',
    'ip',
    'mac',
    'fbId',
    'permission',
    'studentId'
];
    
var config = {
    queryAllowField: {        
        '/current': {            
            post: [
                'name',
                "room-number",
                "ip",
                "mac"
            ]
        },
        
        '/:prop/:value': {
            post: userProperty
        },

        '/query': {
            get: [
                "query"
            ],
            post: [
                'query',
                'user'
            ]
        }        
    },

    resAllowField: {
        general: userProperty,
        nma: userProperty
    },
            
    permissionConfig: {
        general: {
            get: [
                '/current'
            ],
            
            post: [
                '/current'
            ]
        },
        
        nma: {
            get: [
                '/current',
                '/:prop/:value',
                '/query'
            ],
            post: [
                '/current',
                '/:prop/:value',
                '/query'
            ]
        }
    }
};



module.exports = config;

