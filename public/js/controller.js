'use strict';

var app = angular.module( "testUtil", ["ngSanitize"] );

var apis = [
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
