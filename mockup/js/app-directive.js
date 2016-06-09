/* --- uploadFile --- */
jlm.directive('uploadFile', function () {
    'use strict';
	return {
		restrict: 'A',
        scope: {
            uploadFile: "=",// where to put...
            fileExtension: "=",// where to put...
            uploadFileAccept: "@",
            uploadFileText: "@",
            uploadFileName: "@"
        },
		templateUrl: 'view/directive/upload-file.html',
		link: function (scope, elem, attr) {
			angular.element(elem[0].querySelectorAll("input")).bind('change', function (e) {
				var fileName= angular.element(this)[0].value;
				var fileExtension= fileName.substr(fileName.lastIndexOf('.')+1).toLowerCase();
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
                        scope.uploadFile = loadEvent.target.result;
                        scope.fileExtension = fileExtension;
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
/* --- Affix --- */
jlm.directive('affixMe', ['$timeout','$window', function($timeout, $window) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.width = element.prop('offsetWidth');
            var elWidth = scope.width + 'px',
                elChild = angular.element(element[0].querySelector(':first-child'));
                elChild.css('width', elWidth);
            angular.element($window).bind("scroll", function() {
                var affixElement = document.getElementById('affix'),
                    xPosition = 0,
                    yPosition = 0;
                function getPosition(element) {
                    while(element) {
                        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                        element = element.offsetParent;
                    }
                }
                getPosition(affixElement);
                if (yPosition >= 0) {
                    elChild.removeClass('affix');
                } else if ( yPosition < 0) {
                    elChild.addClass('affix');
                };
            });
        }
    };
}])

/* --- profileItem --- */
jlm.directive('profileItem', function () {
    'use strict';
	return {
		restrict: 'A',
        scope: {
            field: "@profileItem",
            directiveName: "@",
            directiveView: "@",
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
				if (typeof attrs.directiveView !== 'undefined' && attrs.directiveView == 'true') {
					html += '<div ' + attrs.directiveName + '="value"></div>';
				} else {
					html += '<div class="no-edit-zone" ng-click="showEditZone()" ng-show="!editZoneShow" tooltip-placement="top-left" uib-tooltip="Edit">';
						var viewT = 'value';
						if (typeof attrs.viewTemplate !== 'undefined' && attrs.viewTemplate !== '') {
							viewT = attrs.viewTemplate;
						}
						if (typeof attrs.breaks !== 'undefined' && attrs.breaks === 'true') {
							viewT = '<ng-bind-html ng-bind-html="' + viewT + ' | nl2br"></ng-bind-html>';
						} else {
							viewT = '{{' + viewT + '}}';
						}
						if (attrs.multy === 'true') {
							html += '<div ng-repeat="value in value">' + viewT + '{{$last ? \'\' : \', \'}}</div>';
						} else {
							html += '<div>' + viewT + '</div>';
						}
					html += '</div>';
					html += '<div class="edit-zone" ng-show="editZoneShow">';
						if (attrs.multy === 'true') {
							html += '<div><div ng-repeat="(key,value) in value"><div ' + attrs.directiveName + '="value"></div></div><div style="margin-top: 5px;"><button type="button" class="btn btn-primary" ng-click="add();">Add</button> <button type="button" class="btn btn-default" ng-click="editZoneClose();">Cancel</button></div></div>';
						} else {
							html += '<div ' + attrs.directiveName + '="value"></div>';
						}
					html += '</div>';
				}
			html += '</div>';
			return html;
		},
		controller: function ($scope, $element, student) {
			$scope.editValue = $scope.value;
			
			$scope.removeItem = function (key) {
				$scope.value.splice(key, 1);
			};
			$scope.add = function () {
				if (typeof $scope.defaultValue !== 'undefined' && $scope.defaultValue !== '') {
					$scope.value.push($scope.defaultValue);
                } else {
                    $scope.value.push({});
                }
				return false;
			};
			$scope.editZoneShow = false;
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
jlm.directive('inputFile', function () {
    'use strict';
	return {
        restrict: 'A',
		scope: false,
		template: 	'<div style="margin-top:5px;margin-bottom:20px;">'+
						'<button class="btn btn-primary" ng-show="value != \'\'" ng-click="download(\'API/Student/myCV\')">Download</button> '+
						'<button class="btn btn-danger" ng-show="value != \'\'" ng-click="deleteCV()">Delete</button> '+
						'<button class="btn btn-success" ngf-select="upload($file)">{{value == \'\'? \'Upload\' : \'Change\' }}</button>'+
					'</div>',
		controller: function ($scope, $element,$window,$http, Upload,student) {
			$scope.deleteCV = function () {
				student.deleteCV().success(function (data) {
					$scope.value = '';
				});
			};
			$scope.upload = function (file) {
				Upload.upload({
					url: 'API/Student/uploadCV',
					data: {file: file, 'username': $scope.username}
				}).then(function (resp) {
					if (typeof resp.data !== 'undefined' && typeof resp.data.status !== 'undefined') {
						if (resp.data.status == 'success') {
							if (typeof resp.data !== 'undefined' && typeof resp.data.new_cv !== 'undefined') {
								console.log(resp.data);
								$scope.value= resp.data.new_cv;
							}else alert('Error..');
						} else {
							if (typeof resp.data !== 'undefined' && typeof resp.data.errors !== 'undefined')
								alert(resp.data.errors.join('\n'));
						}
						
					} else {
						alert('Error..');
					}
				}, function (resp) {
					console.log(resp);
					console.log('Error status: ' + resp.status);
				}, function (evt) {
					console.log(evt);
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			};
			$scope.download = function(url) {
				$window.open(url);
			};
		}
	};
});
jlm.directive('inputSkill', function () {
    'use strict';
	return {
        restrict: 'A',
		scope: false,
		template: 	'<div class="view-skills"><span ng-repeat="(key, skill) in value" ng-click="editSkill(key)">{{skill.name}} {{options.skils_years[skill.years] ? \' : \' + options.skils_years[skill.years] : \'\'}}</span></div>'+
					'<button class="btn btn-success" style="margin-top:5px;margin-bottom:20px;" ng-click="editSkill(-1)">Add more Skill</button>'
		,
		controller: function ($scope, $element,$uibModal) {
		    $scope.editSkill = function (key) {
				if (key == -1) {
					$scope.editSkillData = {
							key : -1,
							id : 0,
							name : '',
							years : '0',
						};
				} else {
					$scope.editSkillData = {
							key : key,
							id : $scope.value[key].id,
							name : $scope.value[key].name,
							years : $scope.value[key].years,
						};
				}
				var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'view/directive/editSkill.html',
						scope: $scope,
						controller: function ($scope, $uibModalInstance, $sce, $q, $rootScope, student) {
							var states = $scope.options.skils;
							var fuzzySearch = new Fuse(states, {
								shouldSort: true,
								caseSensitive: false,
								threshold: 0.4,
							});
							function highlight(val, term) {
								term = term.toLowerCase();
								var tempVal = val.toLowerCase();
								var index = tempVal.indexOf(term);
								if ( index >= 0 ) { 
									val = val.substring(0,index) + "<span class='highlight'>" + val.substring(index,index+term.length) + "</span>" + val.substring(index + term.length);
									return val;
								} else return val;
							}
							function fuzzy_suggest(term) {
								$scope.showChangeForce = false;
								if (!term)
									return [];
								return fuzzySearch
									.search(term)
									.slice(0, 10)
									.map(function (i) {
										var val = states[i];
										return {
											value: val,
											label: $sce.trustAsHtml(highlight(val, term))
									};
								});
							}
							$scope.autocomplete_options = {
								suggest: fuzzy_suggest
							};
							
							function isInArray(value, array) {
								value = value.toLowerCase();
								var tempArr = [];
								for (var i = 0; i < array.length; i++) {
									tempArr.push(array[i].toLowerCase());
								}
								if (tempArr.indexOf(value) > -1)
									return array[tempArr.indexOf(value)];
								else return false;
							}
							
							$scope.showChangeForce = false;
							
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
							$scope.deleteSkill = function () {
								student.deleteSkill($scope.editSkillData.id).success(function (data) {
									if (data.status === 'success') {
										$scope.value.splice($scope.editSkillData.key, 1);
										$uibModalInstance.dismiss('cancel');
									} else {
										$scope.skillAlerts = {type: 'danger', msg: data.errors.join('<br>')};
									}
								});
							};
							$scope.change = function (force) {
								var isInArrayTemp = isInArray($scope.editSkillData.name, $scope.options.skils);
								if ((typeof force !== 'undefined' && force == true) || isInArrayTemp) {
									if (isInArrayTemp)
										$scope.editSkillData.name = isInArrayTemp;
									student.addSkill($scope.editSkillData).success(function (data) {
										if (data.status === 'success') {
											// add skill to student array
											if ($scope.editSkillData.key == -1) {
												$rootScope.studentData.skils.push({id:data.data.id,name:$scope.editSkillData.name,years:String($scope.editSkillData.years)});
												if (!isInArray($scope.editSkillData.name, $scope.options.skils))
													$rootScope.options.skils.push($scope.editSkillData.name);
											} else {
												$rootScope.studentData.skils[$scope.editSkillData.key] = {id:data.data.id,name:$scope.editSkillData.name,years:String($scope.editSkillData.years)};
												if (!isInArray($scope.editSkillData.name, $scope.options.skils))
													$rootScope.options.skils.push($scope.editSkillData.name);
											}
											$uibModalInstance.dismiss('cancel');
										} else {
											$scope.skillAlerts = {type: 'danger', msg: data.errors.join('<br>')};
										}
									});
								} else {
									$scope.showChangeForce = true;
								}
							};
						},
						size: 'sm'
					});
		    };
		}
		/*,
		link: function (scope, elem, attr) {
			scope.$watch(attr.inputSkill, function () {
				scope.editValue = {name: scope.value.name, years: scope.value.years};
			});
		}
		*/
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
