var config = {
    queryAllowField: {        
        '/channel/:channel/message': {
            post: [ 'message' ]
        }        
    },

    permissionConfig: {
        general: {
            get: [ '/channels',
                   '/channels/:status',
                   '/channel/:channel/message/unread',
                   '/channel/:channel/message/before/:messageId',
                   '/channel/:channel/members'
                 ],
            post: ['/channel/new/nma',                
                   '/channel/:channel/message',
                   '/channel/:channel/message/:message/read'
                  ] 
        },
        nma: {
            general: {
                get: [ '/channels',
                       '/channels/:status',
                       '/channel/:channel/message/unread',
                       '/channel/:channel/message/before/:messageId',
                       '/channel/:channel/members'
                     ],
                post: [ '/channel/new',
                        '/channel/:channel/message',
                        '/channel/:channel/message/:message/read',
                        '/channel/:channel/new/member/:fbId',
                        '/alias/nma'
                      ]
            }
        }
    }
};
