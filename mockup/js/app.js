
var jlm = angular.module('jlm', ['ngRoute','ui.bootstrap']);

jlm.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'view/home.html',
      controller: 'UserNotConnected'
    }).
    when('/not-us', {
      templateUrl: 'view/not-us.html',
      controller: 'UserNotConnected'
    }).
    when('/login', {
      templateUrl: 'view/login.html',
      controller: 'UserNotConnected'
    }).
    when('/forgot-password', {
      templateUrl: 'view/forgot-password.html',
      controller: 'UserNotConnected'
    }).
    /*
	when('/profile', {
      templateUrl: 'view/profile.html',
      controller: 'UserConnected'
    }).
	*/
    otherwise({
      redirectTo: '/'
    });
});


// this controller still under construction
jlm.controller('UserNotConnected', function ($scope, $http, student){
  
    $scope.registerData = {};
    $scope.register = function() {
        student.register($scope.registerData).success(function(data){
            console.log(data);
        });
    };
    
    $scope.loginData = {};
    $scope.login = function() {
        student.login($scope.loginData).success(function(data){
            console.log(data);
        });
    };
    
    $scope.logOut = function() {
        student.logOut().success(function (data) {
            console.log(data);
        });
    };
        
});
// this controller still under construction
jlm.controller('UserConnected', function ($scope, $http, $routeParams){
    
    $scope.logOut = function() {
        $http({
            method  : 'POST',
            url     : 'API/Student/logOut',
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            console.log(data);
        });
        
    };
});





jlm.factory('student', ['$http', '$httpParamSerializerJQLike', function ($http, $httpParamSerializerJQLike) {

    return {
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
