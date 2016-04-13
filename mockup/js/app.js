
var jlm = angular.module('jlm', ['ngRoute','ngAnimate','ngSanitize', 'ui.bootstrap']);

var studentData = false;


jlm.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'view/home.html',
            // controller: 'UserNotConnected',
        }).
        when('/not-us', {
            templateUrl: 'view/not-us.html',
            // controller: 'UserNotConnected',
        }).
        when('/login', {
            templateUrl: 'view/login.html',
            controller: 'UserNotConnected',
        }).
        when('/activated', {
            templateUrl: 'view/activated.html',
            controller: 'UserNotConnected',
        }).

        when ('/change-paddword', {
            templateUrl: 'view/change-password.html',
            controller: 'UserConnected'
        }).

        when('/forgot-password', {
            templateUrl: 'view/forgot-password.html',
            controller: 'UserNotConnected',
        }).
        when('/profile', {
            templateUrl: 'view/profile.html',
            controller: 'UserConnected'
        }).
        otherwise({
            redirectTo: '/'
        });
});


jlm.controller('UserNotConnected', function ($scope, $http, $routeParams, $location, student){
    student.init().success(function(data){
        studentData = data;
        if (studentData != false) {
            $location.path( "/profile" );
        }
    });
    
    $scope.register = function() {
        student.register($scope.data.register).success(function(data){
            if (data.status == 'error')
                $scope.alerts.register = {type: 'danger', msg: data.errors.join('<br>')};
            else {
                $scope.alerts.register = {type: 'success', msg: 'Success'};
                // $location.path( "/activated" );
            }
        });
    };
    
    $scope.login = function() {
        student.login($scope.data.login).success(function(data){
            if (data.status == 'error')
                $scope.alerts.login = {type: 'danger', msg: data.errors.join('<br>')};
            else {
                $scope.alerts.login = {type: 'success', msg: 'Success'};
                $location.path( "/profile" );
            }
        });
    };
        
});

jlm.controller('UserConnected', function ($scope, $http, $routeParams, $location, student){
    student.init().success(function(data){
        studentData = data;
        if (studentData == false) {
            $location.path( "/login" );
        }
    });
    $scope.logOut = function() {
        student.logOut().success(function (data) {
            console.log(data);
            if (data.status == 'success')
                $location.path( "/login" );
        });
    };
});
jlm.controller('generalController', function ($scope){
    $scope.data = {};
    $scope.alerts = {};
    $scope.closeAlert = function($index) {
        $scope.alerts[$index] = {};
    }
});





jlm.factory('student', ['$http', '$httpParamSerializerJQLike', function ($http, $httpParamSerializerJQLike) {

    return {
        init: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                return data;
            }).error(function () {return false;});
        },
        login: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/Login',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                return data;
            }).error(function () {return {'status': 'error','errors':'Try again letter please.'};});
        },
        register: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/register',
                data    : $httpParamSerializerJQLike(data),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                return data;
            }).error(function () {return {'status': 'error','errors':'Try again letter please.'};});
        },
        logOut: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student/logOut',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                return data;
            }).error(function () {return {'status': 'error','errors':'Try again letter please.'};});
        },
    }
}]);
