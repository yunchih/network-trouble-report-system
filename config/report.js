
var config = {
    queryAllowField: {        
        '/current': {
            post: [ 'issue', 'description' ]
        },
        
        '/id/:reportId': {
            post: [ 'issue', 'description', 'status', 'solution', 'solved-by' ]
        }
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
                   '/all/fb-id/:fbId'
                 ],
            post: [ '/current',
                    '/id/:reportId'
                  ]
        }
    }
};

module.exports = config;
