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
jlm.controller('StudentActivated', function ($scope, $http, $routeParams, $location, student, $rootScope) {
    "use strict";
    $scope.activatedStatus = false;
	student.init().success(function (data) {
		$scope.alerts.activated = {type: 'warning', msg: 'Please wait for the server.'};
        if ($rootScope.studentData !== false) {
            $location.path("/profile");
        } else {
			student.activated($routeParams.hash).success(function (data) {
				console.log(data);
				if (data.status === 'error')
					$scope.alerts.activated = {type: 'danger', msg: data.errors.join('<br>')};
				else $scope.alerts.activated = {type: 'success', msg: 'Activated successfully.'};
			});
		}
    });
});

jlm.controller('UserConnected', function ($scope, $http, $routeParams, $location, student, general, $rootScope,$uibModal) {
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
	$scope.switchStatusClick = function (changeTo) {
		if (typeof changeTo !== 'undefined' && (changeTo == 0 || changeTo == 1) && changeTo == $rootScope.studentData.status)
			return true;// the status already equal to changeTo
		if ($rootScope.studentData.status === 1) {
			var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'view/directive/changeStatus.html',
					controller: function ($scope, $uibModalInstance, student) {

						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
						$scope.change = function () {
							$scope.data.changeStatus.status = 0;
							student.changeStatus($scope.data.changeStatus).success(function (data) {
								if (data.status === 'success') {
									$rootScope.studentData.status = 0;
									$uibModalInstance.dismiss('cancel');
								} else {
									console.log('errors', data.errors);
								}
							});
						};
					},
					size: 'md'
				});
		} else {
			student.changeStatus({status: 1}).success(function (data) {
				if (data.status === 'success') {
					$rootScope.studentData.status = 1;
				} else {
					console.log('errors', data.errors);
				}
			});
		}
	};
});

jlm.controller('ProfileStrength', function ($scope, $http, $routeParams, $location, $rootScope) {
    "use strict";
	var arrayTips = {
			0: "Awsome! just don't forget to update your data every once in a while! ",
			1: "To raise your profile strength you need to fill Department of Study field ",
			2: "If you'll add a Phone Number your Profile strength will jump with 5%! ",
			3: "Everyone have Linkedin account, so add yours! ",
			4: "Your college name field is blank. ",
			5: "If you'll fill the Degree field your profile strength will grow with 5% ",
			6: "fill the Semester Left field for raise your Profile Strength!",
			7: "The Position wanted field will help you find job that suits for you! ",
			8: "Hi there, fill your experience so the companies will appreciate you much better",
			9: "your Grade average is important  so if you will fill it more job options will open for you!",
			10: "This profile not covering all! upload cv file so the companies will know you better!",
			11: "The Summary field is your place to tell about your self and very importent for the companies witch looking for students",
			12: "The most powerfull strength is your Skills! it's obvious that you have at least 6 skills!"
		};
	$scope.strength = 0;
	$scope.strengthTips = arrayTips[0];    
	$rootScope.$watch("studentData", function(newValue, oldValue) {
		if ($rootScope.studentData) {
			var tipSelect = [];
			var strength = 0;
			
			if($rootScope.studentData.basic_education_subject!=="")
				strength += 5;
			else tipSelect.push(1);
			
			if($rootScope.studentData.phone_number!=="")
				strength += 5;
			else tipSelect.push(2);
			
			if($rootScope.studentData.linkedin!=="")
				strength += 5;
			else tipSelect.push(3);
			
			if($rootScope.studentData.college_id!=="0")
				strength += 5;
			else tipSelect.push(4);
			
			if($rootScope.studentData.degree_id!=="0")
				strength += 5;
			else tipSelect.push(5);
			
			if($rootScope.studentData.semesters_left!=="0")
				strength += 5;
			else tipSelect.push(6);
			
			if($rootScope.studentData.job_percent!=="0")
				strength += 5;
			else tipSelect.push(7);
			
			if($rootScope.studentData.experience!=="")
				strength += 5;
			else tipSelect.push(8);
			
			if($rootScope.studentData.grade_average!=="" && $rootScope.studentData.grade_average!=="0" )
				strength += 10;
			else tipSelect.push(9);
			
			if($rootScope.studentData.cv!=="")
				strength += 10;
			else tipSelect.push(10);
			
			if($rootScope.studentData.summary!=="")
				strength += 10;
			else tipSelect.push(11);
			
			if($rootScope.studentData.skils!==null) {
				if($rootScope.studentData.skils.length < 6) {
					strength += 5*$rootScope.studentData.skils.length;
					tipSelect.push(12);
				} else strength +=30;  
			} else tipSelect.push(12);
			
			$scope.strength = strength;
			
			if (tipSelect.length > 0)
				$scope.strengthTips = arrayTips[tipSelect[Math.floor(Math.random() * tipSelect.length)]];
			else $scope.strengthTips = arrayTips[0];    
		}
	},true);
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
        activated: function (hash) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/activated',
                data    : $httpParamSerializerJQLike({'c': hash}),  // pass in data as strings
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
        addSkill: function (data) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/addSkill',
                data    : $httpParamSerializerJQLike(data),
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        },
        deleteSkill: function (id) {
            return $http({
                method  : 'POST',
                url     : 'API/Student/deleteSkill',
                data    : $httpParamSerializerJQLike({id:id}),
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
        },
        deleteCV: function () {
            return $http({
                method  : 'POST',
                url     : 'API/Student/deleteCV',
                headers : { 'Content-Type':  'application/x-www-form-urlencoded' }
            }).success(function (data) {
                return data;
            }).error(function () {return {'status': 'error', 'errors': 'Please try again later.'}; });
        }
    };
}]);
