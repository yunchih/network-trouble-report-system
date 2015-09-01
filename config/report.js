var generalProp = ['issue', 'description', 'status', 'solution', 'timestamp'];
var nmaProp = ['_id', 'fbId', 'issue', 'description', 'status', 'solution', 'solvedBy', 'ps', 'userUpdateTime', 'timestamp' ];

var config = {
    queryAllowField: {        
        '/current': {
            post: [ 'issue', 'description' ]
        },
        
        '/id/:reportId': {
            post: [ 'issue', 'description', 'status', 'solution', 'solvedBy' ]
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
    }
};

module.exports = config;
