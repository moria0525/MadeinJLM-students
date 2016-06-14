var jlm = angular.module('jlm', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngImgCrop', 'MassAutoComplete', 'ngFileUpload', 'pageslide-directive']);

/* --- routeProvider --- */
jlm.config(function ($routeProvider, $locationProvider) {
    "use strict";
    $routeProvider.
        when('/', {
            templateUrl: 'view/home.html'
        }).
        when('/not-us', {
            templateUrl: 'view/not-us.html'
        }).
        when('/companies', {
            templateUrl: 'view/companies.html'
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
	$rootScope.adminData = false;
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

// mobile nav
jlm.controller('pageslideCtrl',['$scope',function($scope){

	$scope.checked = false;
	$scope.size = '100px';

	$scope.toggle = function() {
		$scope.checked = !$scope.checked
	}

	$scope.mockRouteChange = function () {
		$scope.$broadcast('$locationChangeStart');
	}
}]);

/* --- Filters --- */
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
    };
}]);
