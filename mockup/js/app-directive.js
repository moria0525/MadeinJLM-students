/* --- uploadFile --- */
jlm.directive('uploadFile', function() {
	return {
		restrict: 'A',
        scope: {
            uploadFile: "=",// where to put...
            uploadFileAccept: "@",
            uploadFileText: "@",
            uploadFileName: "@",
			
        },
		templateUrl: 'view/directive/upload-file.html',
		link: function(scope, elem, attr) {
			angular.element(elem[0].querySelectorAll("input")).bind('change', function (e) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.uploadFile = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(e.target.files[0]);
			});
			angular.element(elem[0].querySelectorAll("div")).bind('click', function (e) {
				elem[0].querySelector('input').click()
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
				//debugger;
				e.dataTransfer.dropEffect = 'copy';
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragenter', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.addClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('drop', function(e) {
				var droppedFiles = e.dataTransfer.files;
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
				if (droppedFiles.length > 0) {
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.uploadFile = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(droppedFiles[0]);
				}
			});
		}
	};
});

/* --- fileread --- */
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

/* --- profileSelect --- */
jlm.directive('profileItem', function($timeout) {
	return {
		restrict: 'A',
        scope: {
            /* uploadFile: "=",
            uploadFileAccept: "@", */
            key: "=",
            title: "=",
            data: "=",
            multy: "=",
            value: "=",
			
        },
		templateUrl: 'view/directive/profile-item.html',
		controller: function ($scope,$element) {
			$scope.editValue = $scope.value;
			$scope.editZoneShow = false;
			$scope.showEditZone = function () {
				$scope.editZoneShow = true;
				$timeout(function() {
					$element[0].querySelector('input').focus();
				});
			};
			$scope.editZoneReset = function () {
				$scope.editValue = $scope.value;
				$scope.editZoneShow = true;
				$timeout(function() {
					$element[0].querySelector('input').focus();
				});
			};
			$scope.editZoneSave = function () {
				$scope.value = $scope.editValue;
				// $scope.editZoneShow = false;
			};
		},
		link: function(scope, elem, attr) {
			/*
			scope.bind('click', function (e) {
				elem[0].querySelector('input').click()
			});
			scope.$watch(scope.editZoneShow, function(value) {
				
				if (scope.editZoneShow == true)
					console.log(scope.editZoneShow);
			});
			*/
			/*
			angular.element(elem[0].querySelectorAll("input")).bind('change', function (e) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.uploadFile = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(e.target.files[0]);
			});
			angular.element(elem[0].querySelectorAll("div")).bind('click', function (e) {
				elem[0].querySelector('input').click()
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
				//debugger;
				e.dataTransfer.dropEffect = 'copy';
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragenter', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.addClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('drop', function(e) {
				var droppedFiles = e.dataTransfer.files;
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
				if (droppedFiles.length > 0) {
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.uploadFile = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(droppedFiles[0]);
				}
			});
			*/
		}
	};
});
jlm.directive('profileSelect', function() {
	return {
		restrict: 'A',
        scope: {
            /* uploadFile: "=",
            uploadFileAccept: "@", */
            data: "=",
            multy: "=",
            value: "=",
			
        },
		templateUrl: 'view/directive/profile-select.html',
		link: function(scope, elem, attr) {
			/*
			angular.element(elem[0].querySelectorAll("input")).bind('change', function (e) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.uploadFile = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(e.target.files[0]);
			});
			angular.element(elem[0].querySelectorAll("div")).bind('click', function (e) {
				elem[0].querySelector('input').click()
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
				//debugger;
				e.dataTransfer.dropEffect = 'copy';
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragenter', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.addClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('drop', function(e) {
				var droppedFiles = e.dataTransfer.files;
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
				if (droppedFiles.length > 0) {
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.uploadFile = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(droppedFiles[0]);
				}
			});
			*/
		}
	};
});
