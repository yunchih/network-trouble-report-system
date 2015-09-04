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
    }
};
