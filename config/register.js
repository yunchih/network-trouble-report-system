var userProperty = [
    'name',
    'room_number',
    'student_id',
    'agree',
    'validate_code'
];

module.exports = {
    queryAllowField:{
        "/":{
            "post": userProperty
        },
        "/mail":{
            "post": [ 'student_id' ]
        }
    },
    permissionConfig: {
        nobody: {
            post: [
                "/",
                "/mail"
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
        'agree': /^true$/
    }        

};
