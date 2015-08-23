


var permissionList = {
    general:{

        "current-get": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        },
        "current-post": {
            "roomNumber",
            "ip",
            "mac"
        }

    },

    nma: {

        "current-get": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        },
        "current-post": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        },
        "prop-value-get": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        },

        "prop-value-post": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        },

        "get": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        },

        "post": {
            "fbId",
            "name",
            "studentId",
            "roomNumber",
            "ip",
            "mac",
            "permission"
        }                
    }

};

var user = { permissionList: permissionList };

module.exports = user;

