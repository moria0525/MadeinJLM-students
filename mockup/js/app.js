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
        when('/reset-password', {
            templateUrl: 'view/reset-password.html',
            controller: 'UserNotConnected'
        }).
        when('/new-password/:hash', {
            templateUrl: 'view/new-password.html',
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
        when('/change-password', {
            templateUrl: 'view/change-password.html',
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
                $scope.alerts.register = {type: 'success', msg: 'Activation mail sent'};
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
                $scope.alerts.resetPassword = {type: 'success', msg: 'A link was sent to your mail, you can reset your password with it'};
            }
        });
    };
    $scope.newPassword = function () {
		if($scope.data.newPassword.password !== $scope.data.newPassword.password2){
			$scope.alerts.newPassword = {type: 'danger', msg: 'Passwords does not match'};
		} else {
			student.newPassword($routeParams.hash,{Password: $scope.data.newPassword.password}).success(function (data) {
				if (data.status === 'error') {
					$scope.alerts.newPassword = {type: 'danger', msg: data.errors.join('<br>')};
				} else {
					$scope.alerts.newPassword = {type: 'success', msg: 'Password changed'};
				}
			});
		}
    };
    
    console.log(student);
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
    }; //////////////////////////////////////////////////////////////////////////////////help wanted
   $scope.changePassword = function () {
        if($scope.data.changePassword.password !== $scope.data.changePassword.password2){
			$scope.alerts.changePassword = {type: 'danger', msg: 'Passwords does not match'};
		} else {
            student.changePassword({Password: $scope.data.changePassword.password}).success(function (data) {
                console.log(data);
            if (data.status === 'error') {
                $scope.alerts.changePassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.changePassword = {type: 'success', msg: 'Your password was change successfully'};
            }
        });
    }};
     
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
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        register: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/register',
                data    : $httpParamSerializerJQLike(data),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        logOut: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student/logOut',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        resetPassword: function (email) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/resetPassword',
                data    : $httpParamSerializerJQLike({'Email':email}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later..'}; });
        },
        newPassword: function (hash,newPass) {
            console.log(hash);
            console.log(newPass);
            console.log($httpParamSerializerJQLike({'hash':hash,'newPass':newPass}));
			return $http({
                method  : 'POST',
                url     : 'API/Student/newPassword',
                data    : $httpParamSerializerJQLike({'hash':hash,'newPass':newPass}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        changePassword: function (newPass) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/update',
                data    : $httpParamSerializerJQLike({'newPass':newPass}),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data){
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });      
        },
		
		
		
		
		
    };
}]);



