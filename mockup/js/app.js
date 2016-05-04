var jlm = angular.module('jlm', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngImgCrop']);

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
        templateUrl: 'view/termOfUse.html'
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

jlm.run(function ($rootScope) {
	$rootScope.studentData = false;
});


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

jlm.controller('UserConnected', function ($scope, $http, $routeParams, $location, student, $rootScope) {
    "use strict";
    
    student.init().success(function (data) {
        $rootScope.studentData = data;
        if ($rootScope.studentData === false) {
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
   $scope.changePassword = function () {
        student.changePassword($scope.data.changePassword).success(function (data) {
            console.log(data);
            if (data.status === 'error') {
                $scope.alerts.changePassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.changePassword = {type: 'success', msg: 'Your password was change successfully'};
            }
        });
        /*
       if($scope.data.changePassword.password !== $scope.data.changePassword.password2){
			$scope.alerts.changePassword = {type: 'danger', msg: 'Passwords does not match'};
		} else {
			console.log($scope.data.changePassword);
            student.changePassword($scope.data.changePassword.oldPassword, $scope.data.changePassword.password, $scope.data.changePassword.password2).success(function (data) {
                console.log(data);
            if (data.status === 'error') {
                $scope.alerts.changePassword = {type: 'danger', msg: data.errors.join('<br>')};
            } else {
                $scope.alerts.changePassword = {type: 'success', msg: 'Your password was change successfully'};
            }
        */
    };
     
});
jlm.controller('generalController', function ($scope, $rootScope) {
    "use strict";
    $scope.data = {};
    $scope.alerts = {};
    $scope.closeAlert = function ($index) {
        $scope.alerts[$index] = {};
    };
});

jlm.controller('DropdownCtrl', function ($scope, $log) {

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
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
        changePassword: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/changePassword',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data){
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });      
        },
        uploadProfile: function (picture) {
			var fd = new FormData();
			fd.append('picture', picture);
			return $http.post('API/Student/uploadProfile', fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined,'Process-Data': false}
			}).success(function(data){
				return data;
			}).error(function(){return {'status': 'error', 'errors': 'Please try again later.'}; });
        }
		
		
    };
}]);

jlm.directive('profilePicture', function() {
	return {
		restrict: 'E',
		controller: 'profilePictureCtrl',
		templateUrl: 'view/directive/profile-picture.html'
	};
});
jlm.controller('profilePictureCtrl', function ($scope, $uibModal, $log) {
	
	$scope.openChangeProfileImage = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'view/directive/changeProfileImage.html',
			controller: 'ModalProfileCtrl',
			size: 'md'
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
		
		
});
jlm.controller('ModalProfileCtrl', ['$scope', '$uibModalInstance', '$log', 'student', '$rootScope', function($scope, $uibModalInstance, $log, student, $rootScope){

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.imageDataURI='';
	$scope.resImageDataURI='';
	$scope.onChange=function($dataURI) {
		console.log('onChange fired');
	};
	$scope.onLoadBegin=function() {
		console.log('onLoadBegin fired');
	};
	$scope.onLoadDone=function() {
		console.log('onLoadDone fired');
	};
	$scope.onLoadError=function() {
		console.log('onLoadError fired');
	};
	$scope.$watch('resImageDataURI',function(){
		// console.log('Res image', $scope.resImageDataURI);
	});
   $scope.save = function(){
        student.uploadProfile($scope.resImageDataURI).success(function (data) {
            console.log(data);
			if (data.status === 'error') {
                // $scope.alerts.login = {type: 'danger', msg: data.errors.join('<br>')};
				
            } else {
				//console.log($scope);
                $rootScope.studentData.profile = $scope.resImageDataURI;
				$uibModalInstance.close();
            }
        });
   };
	
}]);

jlm.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
jlm.directive('dragAndDrop', function() {
	return {
		restrict: 'A',
        scope: {
            dragAndDrop: "="
        },
		link: function(scope, elem, attr) {
			elem.bind('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
				//debugger;
				e.dataTransfer.dropEffect = 'copy';
			});
			elem.bind('dragenter', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.addClass('on-drag-enter');
			});
			elem.bind('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
			});
			elem.bind('drop', function(e) {
				var droppedFiles = e.dataTransfer.files;
				e.stopPropagation();
				e.preventDefault();
				alert('drop!');
				if (droppedFiles.length > 0) {
					console.log(droppedFiles);
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.dragAndDrop = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(droppedFiles[0]);
				}
			});
		}
	};
});
