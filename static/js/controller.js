'use strict';

var app = angular.module( "testUtil", ["ngSanitize"] );

var apis = [
    {
        url: "/api/1.0/register",
        method: "post",
        fields: [
            'name',
            'roomNumber',
            'ip',
            'mac',
            'fbId',
            'permission',
            'studentId',
            'agree'
        ]
    },

    {
        url: "/api/1.0/user/current",
        method: "get",
        fields: [
        ]
    },

    {
        url: "/api/1.0/user/current",
        method: "post",
        fields: [
            'name',
            'roomNumber',
            'ip',
            'mac',
            'fbId',
            'permission',
            'studentId'
        ]
    },

    {
        url: "/api/1.0/user/:prop/:value",
        method: "get"
    },
    
    {
        url: "/api/1.0/user/:prop/:value",
        method: "post",
        fields: [
            'name',
            'roomNumber',
            'ip',
            'mac',
            'fbId',
            'permission',
            'studentId'
        ]
    },

    {
        url: "/api/1.0/user/query",
        method: "get",
        fields: [
            "query"
        ]
    },

    {
        url: "/api/1.0/report/current/:status",
        method: "get",
        fields: []
    },

    {
        url: "/api/1.0/report/current",
        method: "get",
        fields: []
    },
    
    {
        url: "/api/1.0/report/current",
        method: "post",
        fields: ['issue', 'description', 'status', 'solution', 'soved-by', 'ps']
    },

    {
        url: "/api/1.0/report/all/status/:status",
        method: "get",
        fields: []
    },

    {
        url: "/api/1.0/report/all/period/:start/:end",
        method: "get",
        fields: []
    },

    {
        url: "/api/1.0/report/all/:prop/:value",
        method: "get",
        fields: []
    },

    {
        url: "/api/1.0/report/id/:reportId",
        method: "post",
        fields: ['issue', 'description', 'status', 'solution', 'solvedBy', 'ps']
    }
    
];


app.controller( "panelController", function( $scope, $http ){
    $scope.apis = apis;
    $scope.query = {};
    $scope.request = function(){
        var currentApi = apis[$scope.currentApiIndex];
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
