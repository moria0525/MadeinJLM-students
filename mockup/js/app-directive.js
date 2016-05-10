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

/* --- profileItem --- */
jlm.directive('profileItem', function() {
	return {
		restrict: 'A',
        scope: {
            value: "=",
            title: "=",
            multy: "=",
            saveFunction: "@",
        },
		// priority: 98,
		templateUrl: 'view/directive/profile-item.html',
		controller: function ($scope,$element) {
			// console.log($scope.value);
			$scope.editValue = $scope.value;
			$scope.showEditZone = function () {
				$scope.editZoneShow = true;
			};
			$scope.editZoneClose = function () {
				$scope.editZoneShow = false;
			};
			$scope.editZoneSave = function (value,key) {
				console.log('value: '+ value);
				console.log('saveFunction: '+ $scope.saveFunction);
				if ($scope.multy)
					console.log('id: '+ key);
			};
		},
		link: function(scope, elem, attr) {
		}
	};
});
/*
jlm.directive('multyData', function ($compile) {
	return {
        restrict: 'A',
        scope: {
            multyData: "=",
            value: "=multyData",
			multy: "=",
        },
		controller: function ($scope,$element) {
			$scope.editValue = '1';
			$scope.value = $scope.multyData;
		},
		priority: 99,
        link: function (scope, element, attrs) {
			var innerHtml = element[0].innerHTML;
			if (scope.multy == '1')
				var html ='<div ng-repeat="value in multyData">' + innerHtml + '</div>';
			else {
				var html ='<div>'+innerHtml+'</div>';
			}
            var e =$compile(html)(scope);
            element.replaceWith(e);
			
        }
	};
});
*/
jlm.directive('multyData', function ($compile) {
	return {
        restrict: 'EA',
        scope: false,
		controller: function ($scope,$element) {

		},
		// priority: 99,
        link: function (scope, element, attrs) {
			var innerHtml = element[0].innerHTML;
			if (scope.multy == '1')
				var html ='<div ng-repeat="(key,value) in value">' + innerHtml + '</div>';
			else {
				var html ='<div>'+innerHtml+'</div>';
			}
            var e =$compile(html)(scope);
            element.replaceWith(e);
			
        }
	};
});
jlm.directive('inputText', function () {
	return {
        restrict: 'A',
        /*
		scope: {
            value: "=inputText",
            // editValue: "=inputText",
            editZoneClose: "&",
            hideCancel: "=",
        },
		*/
		scope: false,
		// priority: 100,
		template: 	'<div class="input-group">'+
						'<input type="text" class="form-control" " ng-model="editValue">'+
						'<div class="input-group-btn">'+
							'<button type="button" class="btn btn-success" ng-click="editZoneSave(editValue,key)" ng-disabled="value == editValue">Save</button>'+
							'<button type="button" class="btn btn-warning" ng-click="editValue = value" ng-disabled="value == editValue">Reset</button>'+
							'<button type="button" class="btn btn-default" ng-show="!multy" ng-click="editZoneClose()">Cancel</button>'+
						'</div>'+
					'</div>',
		controller: function ($scope,$element) {

		},
		link: function(scope, elem, attr) {
			
			scope.$watch(attr.inputText, function() {
				scope.editValue = scope.value;
			});
		}
	};
});
/*
jlm.directive('profileTemplate', function() {
	return {
		restrict: 'A',
		templateUrl: 'API/General/profileEditFormat',
        scope: {
            profileTemplate: "="
        },
		template: 	'<div class="input-group">'+
						'<input type="text" class="form-control" " ng-model="editValue">'+
						'<div class="input-group-btn">'+
							'<button type="button" class="btn btn-success" ng-click="editZoneSave()" ng-disabled="value == editValue">Save</button>'+
							'<button type="button" class="btn btn-warning" ng-click="editZoneReset()" ng-disabled="value == editValue">Reset</button>'+
							'<button type="button" class="btn btn-default" ng-click="editZoneClose()">Cancel</button>'+
						'</div>'+
					'</div>',
		controller: function ($scope,$element) {
			$scope.editValue = '2';
			// console.log($scope.studentData);
		},
		link: function(scope, elem, attr) {
			
		}
	};
});
*/
/*
jlm.directive('profileMulty', function() {
	return {
		restrict: 'A',
        scope: {
            profileMulty: "=",
            value: "=",
        },
		//http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat
		transclude: true,
		template: '<ng-transclude></ng-transclude>',
		controller: function ($scope,$element) {
			$scope.click = function () {
				alert();
			};
		},
		link: function(scope, elem, attr) {
			console.log(1);
			angular.element(elem[0]).on('click', function(e) {
				console.log(2);
				alert();
			});
			
		}
	};
});
*/