var userProperty = [
    '_id',
    'name',
    'roomNumber',
    'fbId',
    'studentId',
    'agree'
];

module.exports = {
    queryAllowField: userProperty,
    permissionConfig: {
        nobody: {
            post: [
                "/"
            ]
        }
    }
};
