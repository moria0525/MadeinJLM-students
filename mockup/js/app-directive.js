/* --- uploadFile --- */
jlm.directive('uploadFile', function () {
    'use strict';
	return {
		restrict: 'A',
        scope: {
            uploadFile: "=",// where to put...
            uploadFileAccept: "@",
            uploadFileText: "@",
            uploadFileName: "@"
        },
		templateUrl: 'view/directive/upload-file.html',
		link: function (scope, elem, attr) {
			angular.element(elem[0].querySelectorAll("input")).bind('change', function (e) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.uploadFile = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(e.target.files[0]);
			});
			angular.element(elem[0].querySelectorAll("div")).bind('click', function (e) {
				elem[0].querySelector('input').click();
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
				//debugger;
				e.dataTransfer.dropEffect = 'copy';
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragenter', function (e) {
				e.stopPropagation();
				e.preventDefault();
				elem.addClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('dragleave', function (e) {
				e.stopPropagation();
				e.preventDefault();
				elem.removeClass('on-drag-enter');
			});
			angular.element(elem[0].querySelectorAll("div")).bind('drop', function (e) {
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
					};
					reader.readAsDataURL(droppedFiles[0]);
				}
			});
		}
	};
});

/* --- fileread --- */
jlm.directive("fileread", [function () {
    'use strict';
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
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);

/* --- profileItem --- */
jlm.directive('profileItem', function () {
    'use strict';
	return {
		restrict: 'A',
        scope: {
            field: "@profileItem",
            directiveName: "@",
            value: "=",
            title: "=",
            options: "=",
            defaultValue: "=",
            multy: "=",
            maxlength: "=",
            breaks: "=",
            saveFunction: "@",
            viewTemplate: "@"
        },
		template: function (element, attrs) {
			var html = '';
			html += '<label class="col-sm-4 profileItemLable" ng-click="showEditZone()" tooltip-placement="top-right" uib-tooltip="Edit">{{ title }}:</label>';
			html += '<div class="col-sm-8">';
			html += '<div class="no-edit-zone" ng-click="showEditZone()" ng-show="!editZoneShow" tooltip-placement="top-left" uib-tooltip="Edit">';
            var viewT = 'value';
            if (typeof attrs.viewTemplate !== 'undefined' && attrs.viewTemplate !== '') {
                viewT = attrs.viewTemplate;
            }
            if (typeof attrs.breaks !== 'undefined' && attrs.breaks === 'true') {
                viewT = '<ng-bind-html ng-bind-html="' + viewT + ' | nl2br"></ng-bind-html>';
            } else { viewT = '{{' + viewT + '}}';
                   }
            if (attrs.multy === 'true') {
                html += '<div ng-repeat="value in value">' + viewT + '{{$last ? \'\' : \', \'}}</div>';
            } else {
                html += '<div>' + viewT + '</div>';
            }
			html += '</div>';
			html += '<div class="edit-zone" ng-show="editZoneShow">';
            if (attrs.multy === 'true') {
                html += '<div><div ng-repeat="(key,value) in value"><div ' + attrs.directiveName + '="value"></div></div><button type="button" class="btn btn-primary" ng-click="add();">Add</button> <button type="button" class="btn btn-default" ng-click="editZoneClose();">Cancel</button></div>';
            } else {
                html += '<div ' + attrs.directiveName + '="value"></div>';
            }
			html += '</div>';
			html += '</div>';
			return html;
		},
		controller: function ($scope, $element, student) {
			$scope.editValue = $scope.value;
			
			$scope.removeItem = function (key) {
				$scope.value.splice(key, 1);
			};
			$scope.add = function () {
				console.log('add new');
				if (typeof $scope.defaultValue !== 'undefined' && $scope.defaultValue !== '') {
					$scope.value.push($scope.defaultValue);
                } else {
                    $scope.value.push({});
                }
				console.log($scope.value);
				return false;
			};
			
			$scope.showEditZone = function () {
				$scope.editZoneShow = true;
			};
			$scope.editZoneClose = function () {
				$scope.editZoneShow = false;
			};
			$scope.editZoneSave = function (value, key) {
				var sendData = {};
				
				sendData[$scope.field] = value;
				
				if ($scope.multy) {
					sendData['key'] = key;
					console.log(sendData);
					/*
					student[$scope.saveFunction](sendData).success(function (data){
						console.log(data);
						if (data.status == 'success') {
							$scope.value = value;
							$scope.editZoneClose();
							console.log('success');
						} else alert('error');
					});
					*/
				} else {
					student[$scope.saveFunction](sendData).success(function (data) {
						console.log(data);
						if (data.status === 'success') {
							$scope.value = value;
							$scope.editZoneClose();
							console.log('success');
						} else {
                            alert('error');
                        }
					});
				}
				
			};
		}
	};
});
jlm.directive('inputText', function () {
    'use strict';
	return {
        restrict: 'A',
		scope: false,
		template: '<form ng-submit="editZoneSave(editValue,key)">' +
						'<div class="input-group">' +
							'<input type="text" class="form-control" " ng-model="editValue" maxlength="{{maxlength}}">' +
							'<div class="input-group-btn">' +
								'<button type="button" class="btn btn-success" ng-click="editZoneSave(editValue,key)" ng-disabled="value == editValue">Save</button>' +
								'<button type="button" class="btn btn-warning" ng-click="editValue = value" ng-disabled="value == editValue">Reset</button>' +
								'<button type="button" class="btn btn-default" ng-show="!multy" ng-click="editZoneClose()">Cancel</button>' +
							'</div>' +
						'</div>' +
					'</form>',
		controller: function ($scope, $element) {
		},
		link: function (scope, elem, attr) {
			scope.$watch(attr.inputText, function () {
				scope.editValue = scope.value;
			});
		}
	};
});
jlm.directive('inputTextarea', function () {
    'use strict';
	return {
        restrict: 'A',
		scope: false,
		template: '<form ng-submit="editZoneSave(editValue,key)">' +
						'<div class="form-group"><textarea class="form-control" rows="7" ng-model="editValue" maxlength="{{maxlength}}"></textarea></div> ' +
						'<div class="text-right form-group">' +
							'<button type="button" class="btn btn-success" ng-click="editZoneSave(editValue,key)" ng-disabled="value == editValue">Save</button> ' +
							'<button type="button" class="btn btn-warning" ng-click="editValue = value" ng-disabled="value == editValue">Reset</button> ' +
							'<button type="button" class="btn btn-default" ng-show="!multy" ng-click="editZoneClose()">Cancel</button>' +
						'</div>' +
					'</form>',
		controller: function ($scope, $element) {
		},
		link: function (scope, elem, attr) {
			scope.$watch(attr.inputTextarea, function () {
				scope.editValue = scope.value;
			});
		}
	};
});
jlm.directive('inputSelect', function () {
    'use strict';
	return {
        restrict: 'A',
		scope: false,
		template: '<div class="input-group">' +
						'<select class="form-control" ng-model="editValue"><option value="0" disabled>select from the list</option><option ng-repeat="(key,name) in options" value="{{key}}">{{name}}</option></select>' +
						'<div class="input-group-btn">' +
							'<button type="button" class="btn btn-success" ng-click="editZoneSave(editValue,key)" ng-disabled="value == editValue">Save</button>' +
							'<button type="button" class="btn btn-warning" ng-click="editValue = value" ng-disabled="value == editValue">Reset</button>' +
							'<button type="button" class="btn btn-default" ng-show="!multy" ng-click="editZoneClose()">Cancel</button>' +
						'</div>' +
					'</div>',
		controller: function ($scope, $element) {

		},
		link: function (scope, elem, attr) {
			scope.$watch(attr.inputSelect, function () {
				scope.editValue = scope.value;
			});
		}
	};
});
jlm.directive('inputSkill', function () {
    'use strict';
	return {
        restrict: 'A',
		scope: false,
		template: '<form class="itemInItem row">' +
						'<div class="form-group col-md-6">' +
							// '<label>enter skill</label>' +
							'<input type="text" class="form-control" placeholder="Skill" ng-model="editValue.name">' +
						'</div>' +
						'<div class="form-group col-md-6">' +
							// '<label>enter years</label>' +
							'<select class="form-control" ng-model="editValue.years"><option value="0" disabled>select years</option><option ng-repeat="(key,name) in options.skils_years" value="{{key}}">{{name}}</option></select>' +
						'</div>' +
						'<div class="text-right col-md-12"><button type="submit" class="btn btn-danger" ng-click="remove()">Remove</button> <button type="submit" ng-disabled="value.name == editValue.name && value.years == editValue.years" ng-click="reset()" class="btn btn-warning">Reset</button> <button type="submit" ng-disabled="value.name == editValue.name && value.years == editValue.years" ng-click="save()" class="btn btn-success">Save</button></div>' +
					'</form>',
		controller: function ($scope, $element) {
			
			$scope.reset = function () {
				if (typeof $scope.value.name !== 'undefined') {
					$scope.editValue.name = $scope.value.name;
                } else {
                    $scope.editValue.name = '';
                }
				if (typeof $scope.value.years !== 'undefined') {
					$scope.editValue.years = $scope.value.years;
                } else {
                    $scope.editValue.years = '';
                }
			};
			$scope.remove = function () {
				console.log('need to remove by service id: ' + $scope.value.id + ', key: ' + $scope.key);
				$scope.removeItem($scope.key);
			};
			$scope.save = function () {
				if (typeof $scope.value.id !== 'undefined') {
					console.log('update - ' + $scope.value.id);
					$scope.editZoneSave($scope.editValue, $scope.value.id);
				} else {
					console.log('add new');
				}
			};
		},
		link: function (scope, elem, attr) {
			scope.$watch(attr.inputSkill, function () {
				scope.editValue = {name: scope.value.name, years: scope.value.years};
			});
		}
	};
});

/* --- switch status --- */
jlm.directive('switchStatus', function () {
    'use strict';
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        template: function (element, attrs) {
            var html = '';
            html += '<span';
            html +=   ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
            html +=   ' ng-click="switchStatusClick()"';
            html +=   ' ng-class="{ checked:studentData.status }"';
            html +=   '>';
            html +=   '<small></small>';
            html +=   '<input type="checkbox"';
            html +=     ' name="studentData.status"';
            html +=     ' ng-model="studentData.status"';
            html +=     ' style="display:none" />';
            html += '</span>';
            return html;
        },
        controller: function ($scope, $element, $uibModal, $rootScope, student) {
		    $scope.switchStatusClick = function () {
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
	    }
    };
});
