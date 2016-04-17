var jlm = angular.module('jlm', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

var studentData = false;












jlm.config(function ($routeProvider) {
    "use strict";
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

        when('/change-password', {
            templateUrl: 'view/change-password.html',
            controller: 'UserNotConnected',
        }).

        when('/reset-password', {
            templateUrl: 'view/reset-password.html',
            controller: 'UserNotConnected'
        }).
        when('/reset-password/:Confirmation', {
            templateUrl: 'view/reset-password-change.html',
            controller: 'UserNotConnected'
        }).
        when('/termOfUse', {
        templateUrl: 'view/termOfUse.html',
        controller: 'UserNotConnected',
        }).
        when('/profile', {
            templateUrl: 'view/profile.html',
            controller: 'UserConnected',
        }).

        otherwise({
            redirectTo: '/'
        });
});


jlm.controller('UserNotConnected', function ($scope, $http, $routeParams, $location, student) {
    "use strict";
    student.init().success(function (data) {
        studentData = data;
        if (studentData !== false) {
            $location.path("/profile");
        }
    });
    
    $scope.register = function () {
        student.register($scope.data.register).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.register = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.register = {type: 'success', msg: 'נשלח למייל, מייל אקטיבציה'};
            }
        });
    };
    
    $scope.login = function () {
        student.login($scope.data.login).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.login = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.login = {type: 'success', msg: 'Success'};
                $location.path("/profile");
            }
        });
    };
    
    $scope.resetPassword = function () {
        student.resetPassword($scope.data.resetPassword.Email).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.resetPassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.resetPassword = {type: 'success', msg: 'נשלח קישור למייל שלך, שאיתו ניתן לאפס את הסיסמא'};
            }
        });
    };
    $scope.resetPasswordChange = function () {
        console.log($routeParams.Confirmation);
        console.log($scope.data.resetPasswordChange);
		/*
		student.resetPassword($scope.data.resetPassword.Email).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.resetPassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.resetPassword = {type: 'success', msg: 'נשלח קישור למייל שלך, שאיתו ניתן לאפס את הסיסמא'};
            }
        });
		*/
    };
    
    console.log(student);
    student.changePassword = function () {
        console.log("hello 1");
//        student.changePassword().success(function (data) {
//            if (data.status === 'success') {
//                $location.path("/profile");
//            }
//        });
    };
    
        
});

jlm.controller('UserConnected', function ($scope, $http, $routeParams, $location, student) {
    "use strict";
    
    student.init().success(function (data) {
        studentData = data;
        if (studentData === false) {
            $location.path("/login");
        }
    });
    $scope.logOut = function () {
        student.logOut().success(function (data) {
            console.log(data);
            if (data.status === 'success') {
                $location.path("/login");
            }
        });
    };
    
});
jlm.controller('generalController', function ($scope) {
    "use strict";
    $scope.data = {};
    $scope.alerts = {};
    $scope.closeAlert = function ($index) {
        $scope.alerts[$index] = {};
    };
});








jlm.factory('student', ['$http', '$httpParamSerializerJQLike', function ($http, $httpParamSerializerJQLike) {
    "use strict";
    return {
        init: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return false; });
        },
        login: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/Login',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Try again letter please.'}; });
        },
        register: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/register',
                data    : $httpParamSerializerJQLike(data),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Try again letter please.'}; });
        },
        logOut: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student/logOut',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Try again letter please.'}; });
        },
        resetPassword: function (email) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/resetPassword',
                data    : $httpParamSerializerJQLike({'Email':email}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Try again letter please.'}; });
        },
		changePassword: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student/changePassword',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Try again letter please.'}; });
        },
		
		
		
		
		
		
		
    };
}]);



