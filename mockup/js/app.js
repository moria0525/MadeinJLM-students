var jlm = angular.module('jlm', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngImgCrop']);

/* --- routeProvider --- */
jlm.config(function ($routeProvider, $locationProvider) {
    "use strict";
    $routeProvider.
        when('/', {
            templateUrl: 'view/home.html'
            // controller: 'UserNotConnected',
        }).
        when('/not-us', {
            templateUrl: 'view/not-us.html'
            // controller: 'UserNotConnected',
        }).

        when('/login', {
            templateUrl: 'view/login.html',
            controller: 'UserNotConnected'
        }).
        when('/activated', {
            templateUrl: 'view/activated.html',
            controller: 'UserNotConnected'
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
            templateUrl: 'view/termOfUse.html'
        }).
        when('/profile', {
            templateUrl: 'view/profile.html',
            controller: 'UserConnected'
        }).
        when('/change-password', {
            templateUrl: 'view/change-password.html',
            controller: 'UserConnected'
        }).
		when('/admin-login', {
            templateUrl: 'view/admin-login.html',
            controller: 'AdminNotConnected'
        }).
		when('/admin-reset-password', {
            templateUrl: 'view/admin-reset-password.html',
            controller: 'AdminNotConnected'
        }).
		when('/admin-new-password/:hash', {
            templateUrl: 'view/admin-new-password.html',
            controller: 'AdminNotConnected'
        }).
		when('/admin-change-password', {
            templateUrl: 'view/admin-change-password.html',
            controller: 'AdminConnected'
        }).
		when('/admin', {
            templateUrl: 'view/admin.html',
            controller: 'AdminConnected'
        }).
        otherwise({
            redirectTo: '/'
        });
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
});

/* --- rootScope --- */
jlm.run(function ($rootScope) {
	'use strict';
	$rootScope.studentData = false;
	$rootScope.options = {
	    'basic_education_years': {1: 'Less then 12 years', 2: '12 years', 3: '13 years', 4: '14 years'},
		'skils_years': {1: 'less then 1 year', 2: '1 year', 3: '2 years', 4: '3 years', 5: 'more then 3 years'},
		'semesters_left': {1: '1 semester', 2: '2 semesters', 3: '3 semesters', 4: '4 semesters', 5: '5 semesters', 6: '6 semesters', 7: '7 semesters', 8: 'more than 7 semesters'},
		'job_percent': {1: 'Half', 2: 'Full job', 3: 'Hours', 4: 'Freelancer'},
		'possible': {1: 'Possible', 2: 'Not possible'},
		'skils': {},
		'degrees': {},
		'languages': {},
		'colleges': {}
	};
});

/* --- controlers --- */
jlm.controller('UserNotConnected', function ($scope, $http, $routeParams, $location, student, $rootScope) {
    "use strict";
    student.init().success(function (data) {
        $rootScope.studentData = data;
        if ($rootScope.studentData !== false) {
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
		if ($scope.data.newPassword.password !== $scope.data.newPassword.password2) {
			$scope.alerts.newPassword = {type: 'danger', msg: 'Passwords does not match'};
		} else {
			student.newPassword($routeParams.hash, {Password: $scope.data.newPassword.password}).success(function (data) {
				if (data.status === 'error') {
					$scope.alerts.newPassword = {type: 'danger', msg: data.errors.join('<br>')};
				} else {
					$scope.alerts.newPassword = {type: 'success', msg: 'Password changed'};
				}
			});
		}
    };
});

    //admin area
jlm.controller('AdminNotConnected', function ($scope, $http, $routeParams, $location, admin, $rootScope) {
	'use strict';
	
	admin.init().success(function (data) {
        
        $rootScope.adminData = data;
        if ($rootScope.adminData !== false) {
            $location.path("/admin-login");
        }
        console.log($rootScope);
        console.log("*******************");
        console.log(data);
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

jlm.controller('UserConnected', function ($scope, $http, $routeParams, $location, student, general, $rootScope) {
    "use strict";
    
    student.init().success(function (data) {
        $rootScope.studentData = data;
        if ($rootScope.studentData === false) {
            $location.path("/login");
        }
    });
    general.getOptions().success(function (data) {
		angular.forEach(data, function (value, key) {
			if ($rootScope.options[key])
		    $rootScope.options[key] = value;
		});
    });
    $scope.logOut = function () {
        student.logOut().success(function (data) {
            if (data.status === 'success') {
                $location.path("/login");
            }
        });
    };
    $scope.changePassword = function () {
        student.changePassword($scope.data.changePassword).success(function (data) {
            if (data.status === 'error') {
                $scope.alerts.changePassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.changePassword = {type: 'success', msg: 'Your password was change successfully'};
            }
        });
    };
});
	//admin area
	
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

jlm.controller('generalController', function ($scope, $rootScope, student) {
    "use strict";
    $scope.data = {};
    $scope.alerts = {};
    $scope.closeAlert = function ($index) {
        $scope.alerts[$index] = {};
    };
});

jlm.controller('DropdownCtrl', function ($scope, $log) {
    'use strict';
	$scope.status = {
		isopen: false
	};

	$scope.toggled = function (open) {
		$log.log('Dropdown is now: ', open);
	};

	$scope.toggleDropdown = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};

	$scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
});


/* --- profile --- */
jlm.directive('profilePicture', function () {
	'use strict';
	return {
		restrict: 'E',
		controller: 'profilePictureCtrl',
		templateUrl: 'view/directive/profile-picture.html'
	};
});
jlm.controller('profilePictureCtrl', function ($scope, $uibModal, $log) {
	'use strict';
	$scope.openChangeProfileImage = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'view/directive/changeProfileImage.html',
			controller: 'ModalProfileCtrl',
			size: 'md'
		});
		/*
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
		*/
	};
		
		
});
jlm.controller('ModalProfileCtrl', ['$scope', '$uibModalInstance', '$log', 'student', '$rootScope', function ($scope, $uibModalInstance, $log, student, $rootScope) {
	'use strict';
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.imageDataURI = '';
	$scope.resImageDataURI = '';
	$scope.onChange = function ($dataURI) {
		// console.log('onChange fired');
	};
	$scope.onLoadBegin = function () {
		// console.log('onLoadBegin fired');
	};
	$scope.onLoadDone = function () {
		// console.log('onLoadDone fired');
	};
	$scope.onLoadError = function () {
		// console.log('onLoadError fired');
	};
	$scope.$watch('resImageDataURI', function () {
		// console.log('Res image', $scope.resImageDataURI);
	});
	$scope.save = function () {
		
        student.uploadProfile($scope.resImageDataURI).success(function (data) {
			if (data.status === 'error') {
                // $scope.alerts.login = {type: 'danger', msg: data.errors.join('<br>')};
				console.log(data.errors);
            } else {
                $rootScope.studentData.profile = $scope.resImageDataURI;
				$uibModalInstance.close();
            }
        });
		
	};

}]);

jlm.filter('nl2br', function ($sce) {
    'use strict';
	return function (msg, is_xhtml) {
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        return $sce.trustAsHtml(msg);
    };
});

/* --- services --- */
jlm.factory('student', ['$http', '$httpParamSerializerJQLike', function ($http, $httpParamSerializerJQLike) {
    "use strict";
    return {
        init: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
				if (typeof data.status !== 'undefined' && data.status !== null) {
					data.status = parseInt(data.status);
				}
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
                data    : $httpParamSerializerJQLike({'Email': email}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later..'}; });
        },
        newPassword: function (hash, newPass) {
			return $http({
                method  : 'POST',
                url     : 'API/Student/newPassword',
                data    : $httpParamSerializerJQLike({'hash': hash, 'newPass': newPass}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        changePassword: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/changePassword',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        update: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/update',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        changeStatus: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/changeStatus',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        uploadProfile: function (picture) {
			var fd = new FormData();
			fd.append('picture', picture);
			return $http.post('API/Student/uploadProfile', fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined, 'Process-Data': false}
			}).success(function (data) {
				return data;
			}).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        }
    };
}]);
jlm.factory('general', ['$http', '$httpParamSerializerJQLike', function ($http, $httpParamSerializerJQLike) {
    "use strict";
	return {
		getOptions: function () {
            return $http({
                method  : 'POST',
                url     : 'API/General/getOptions',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {}; });
        }
		/*
		profileEditFormat: function () {
            return $http({
                method  : 'POST',
                url     : 'API/General/profileEditFormat',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {}; });
        },
		*/
    };
}]);

//admin

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




