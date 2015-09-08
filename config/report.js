var generalProp = ['issue', 'description', 'status', 'solution', 'timestamp', 'user_available_time'];
var nmaProp = ['_id', 'fbId', 'issue', 'description', 'status', 'solution', 'solved_by', 'ps', 'user_update_time', 'timestamp', 'user_available_time' ];

var config = {
    queryAllowField: {        
        '/current': {
            post: [ 'issue', 'description', 'user_available_time' ]
        },
        
        '/id/:reportId': {
            post: [ 'issue', 'description', 'status', 'solution', 'solved_by' ]
        }
    },

    resAllowField: {
        general: generalProp,        
        nma: nmaProp
    },

    permissionConfig: {
        general: {
            get: [ '/current',
                   '/current/:status' ],
            post: [ '/current' ]
        },
        nma: {
            get: [ '/current',
                   '/current/:status',
                   '/all/status/:status',
                   '/all/period/:start/:end',
                   '/all/:prop/:value',
                   '/all/fb-id/:fbId'
                 ],
            post: [ '/current',
                    '/id/:reportId'
                  ]
        }
    },
    
    queryReg: {
        issue: /.{0,1000}/,
        description: /.{0,1000}/,
        user_available_time: /.{0,200}/
    }

};

module.exports = config;
