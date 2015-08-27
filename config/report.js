var generalProp = ['issue', 'description', 'status', 'solution'];
var nmaProp = ['issue', 'description', 'status', 'solution', 'soved-by', 'ps'];

var config = {
    queryAllowField: {        
        '/current': {
            post: [ 'issue', 'description' ]
        },
        
        '/id/:reportId': {
            post: [ 'issue', 'description', 'status', 'solution', 'solved-by' ]
        }
    },

    resAllowField: {
        general:{
            generalProp
        },
        
        nma: {
            nmaProp
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
