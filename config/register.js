var userProperty = [
    '_id',
    'name',
    'roomNumber',
    'fbId',
    'studentId',
    'agree'
];

module.exports = {
    queryAllowField:{
        "/":{
            "post": userProperty
        }
    },
    permissionConfig: {
        nobody: {
            post: [
                "/"
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
        'studentId': /^B\d{2}[\dABHJKQZ]\d{5}$/,
        'agree': /^true$/
    }        

};
