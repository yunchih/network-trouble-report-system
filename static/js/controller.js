'use strict';

var app = angular.module( "testUtil", ["ngSanitize"] );

var apis = [
    {
        url: "/api/1.0/register",
        method: "post",
        fields: [
            'access_token',
            'name',
            'room_number',
            'ip',
            'mac',
            'fb_id',
            'permission',
            'student_id',
            'agree'
        ]
    },

    {
        url: "/api/1.0/register/mail",
        method: "post",
        fields: [
            "student_id"
        ]
    },
    
    {
        url: "/api/1.0/user/current",
        method: "get",
        fields: [
            'access_token'
        ]
    },

    {
        url: "/api/1.0/user/current",
        method: "post",
        fields: [
            'access_token',
            'name',
            'room_number',
            'ip',
            'mac',
            'fb_id',
            'permission',
            'student_id'
        ]
    },

    {
        url: "/api/1.0/user/:prop/:value",
        method: "get",
        fields: ['access_token']
    },
    
    {
        url: "/api/1.0/user/:prop/:value",
        method: "post",
        fields: [
            'access_token',
            'name',
            'room_number',
            'ip',
            'mac',
            'fb_id',
            'permission',
            'student_id'
        ]
    },

    {
        url: "/api/1.0/user/query",
        method: "get",
        fields: [
            'access_token',
            "query"
        ]
    },

    {
        url: "/api/1.0/user/new-user",
        method: "post",
        fields: [
            'users'
        ]
    },


    {
        url: "/api/1.0/report/current/:status",
        method: "get",
        fields: ['access_token']
    },

    {
        url: "/api/1.0/report/current",
        method: "get",
        fields: ['access_token']
    },
    
    {
        url: "/api/1.0/report/current",
        method: "post",
        fields: ['access_token','issue', 'description', 'status', 'solution', 'soved_by', 'ps']
    },

    {
        url: "/api/1.0/report/all/status/:status",
        method: "get",
        fields: ['access_token']
    },

    {
        url: "/api/1.0/report/all/period/:start/:end",
        method: "get",
        fields: ['access_token']
    },

    {
        url: "/api/1.0/report/all/:prop/:value",
        method: "get",
        fields: ['access_token']
    },

    {
        url: "/api/1.0/report/id/:reportId",
        method: "post",
        fields: ['access_token', 'issue', 'description', 'status', 'solution', 'solved_by', 'ps']
    }
    
];


app.controller( "panelController", function( $scope, $http ){
    $scope.apis = apis;
    $scope.query = {};
    $scope.request = function(){
        var currentApi = apis[$scope.currentApiIndex];
        $scope.query.access_token = access_token;
        $scope.query.recaptcha = document.getElementById("g-recaptcha-response").value;
        if( currentApi.method === "get" ){
            $scope.message = "get";
            $http.get( currentApi.url, { params: $scope.query } )
                .then( function( res ){
                    $scope.result = res;
                },function( res ){
                    $scope.result = res;
                });                                              
        }else{
            $scope.message = "post";
            $http.post( currentApi.url, undefined, { headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                          params: $scope.query} )
                .then( function( res ){
                    $scope.result = res;
                },function( res ){
                    $scope.result = res;
                });                                                          
        }            
    };

    $scope.clearQuery = function(){
        $scope.query = {};
    };
});
