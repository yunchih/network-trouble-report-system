var userProperty = [
    '_id',
    'name',
    'room_number',
    'ip',
    'mac',
    'fb_id',
    'permission',
    'student_id',
    'phone'
];
    
var config = {
    queryAllowField: {        
        '/current': {            
            post: [
                'name',
                "room_number",
                "ip",
                "mac",
                'phone'
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
        },

        '/new-user': {
            post: [ 'users' ]
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
                '/query',
                '/new-user'
            ]
        }
    },

    queryReg: {
        '_id': /^[a-z0-9]{24}$/,
        'name': /^.{0,20}$/,
        'room_number': /^\d{3}[A-D]$/,
        'ip': /^140\.112(\.((25[0-5])|(2[0-4]\d)|(1?\d{0,2}))){2}$/,
        'mac': /^([A-F]{2}-){5}[A-F]{2}$/,
        'fb_id': /^\d+$/,
        'permission': /^\w+$/,
        'student_id': /^B\d{2}[\dABHJKQZ]\d{5}$/,
        'phone': /09\d{8}/
    },

    validateLength: 32
};



module.exports = config;

