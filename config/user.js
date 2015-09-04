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
    },

    queryReg: {
        '_id': /^[a-z0-9]{24}$/,
        'name': /^.{0,20}$/,
        'roomNumber': /^\d{3}[A-D]$/,
        'ip': /^140\.112(\.((25[0-5])|(2[0-4]\d)|(1?\d{0,2}))){2}$/,
        'mac': /^([A-F]{2}-){5}[A-F]{2}$/,
        'fbId': /^\d+$/,
        'permission': /^\w+$/,
        'studentId': /^B\d{2}[\dABHJKQZ]\d{5}$/
    }        
};



module.exports = config;

