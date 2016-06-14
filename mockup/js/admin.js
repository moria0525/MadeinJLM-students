/* --- admin area --- */
jlm.controller('AdminNotConnected', function ($scope, $http, $routeParams, $location, admin, $rootScope) {
	'use strict';
	
	admin.init().success(function (data) {
        
        $rootScope.adminData = data;
        if ($rootScope.adminData !== false) {
            $location.path("/admin-login");
        }
        
    });
		
	$scope.adminlogin = function () {
        admin.adminlogin($scope.data.adminlogin).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.adminlogin = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.adminlogin = {type: 'success', msg: 'Success'};
                $location.path("/admin");
            }
        });
    };
	$scope.adminresetPassword = function () {
        admin.adminresetPassword($scope.data.adminresetPassword.Email).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.adminresetPassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.adminresetPassword = {type: 'success', msg: 'A link was sent to your mail, you can reset your password with it'};
            }
        });
    };
	$scope.adminnewPassword = function () {
		if ($scope.data.adminnewPassword.password !== $scope.data.adminnewPassword.password2) {
			$scope.alerts.adminnewPassword = {type: 'danger', msg: 'Passwords does not match'};
		} else {
			student.adminnewPassword($routeParams.hash, {Password: $scope.data.adminnewPassword.password}).success(function (data) {
				if (data.status === 'error') {
					$scope.alerts.adminnewPassword = {type: 'danger', msg: data.errors.join('<br>')};
				} else {
					$scope.alerts.adminnewPassword = {type: 'success', msg: 'Password changed'};
				}
			});
		}
    };
	
	 
});

jlm.controller('AdminConnected', function ($scope, $http, $routeParams, $location, admin, general, $rootScope) {
	'use strict';
	admin.init().success(function (data) {
        $rootScope.adminData = data;
        if ($rootScope.adminData === false) {
            $location.path("/admin-login");
        }
    });
	$scope.adminlogOut = function () {
        admin.adminlogOut().success(function (data) {
            if (data.status === 'success') {
                $location.path("/admin-login");
            }
        });
    };
	
	$scope.adminchangePassword = function () {
        admin.adminchangePassword($scope.data.adminchangePassword).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.adminchangePassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.adminchangePassword = {type: 'success', msg: 'Your password was change successfully'};
            }
        });
    };
	
});

/* --- services --- */

jlm.factory('admin', ['$http', '$httpParamSerializerJQLike', function ($http, $httpParamSerializerJQLike) {
    "use strict";
    return {
        init: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Admin',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
				if (typeof data.status !== 'undefined' && data.status !== null) {
					data.status = parseInt(data.status);
				}
				return data;
            }).error(function () {return false; });
        },
        adminlogin: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Admin/login',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
		
        adminlogOut: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Admin/logOut',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        adminresetPassword: function (email) {
            return $http({
                method  : 'POST',
                url     : 'API/Admin/resetPassword',
                data    : $httpParamSerializerJQLike({'Email': email}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later..'}; });
        },
        adminnewPassword: function (hash, newPass) {
			return $http({
                method  : 'POST',
                url     : 'API/Admin/newPassword',
                data    : $httpParamSerializerJQLike({'hash': hash, 'newPass': newPass}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        adminchangePassword: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Admin/changePassword',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        adminupdate: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Admin/update',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        }
       
    };
}]);