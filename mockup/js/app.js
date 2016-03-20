
var jlm = angular.module('jlm', ['ngRoute','ui.bootstrap']);

jlm.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'view/home.html',
      controller: 'UserNotConnected'
    }).
    when('/not-us', {
      templateUrl: 'view/not-us.html',
      controller: 'UserNotConnected'
    }).
    when('/login', {
      templateUrl: 'view/login.html',
      controller: 'UserNotConnected'
    }).
    when('/forgot-password', {
      templateUrl: 'view/forgot-password.html',
      controller: 'UserNotConnected'
    }).
    /*
	when('/profile', {
      templateUrl: 'view/profile.html',
      controller: 'UserConnected'
    }).
	*/
    otherwise({
      redirectTo: '/'
    });
	/*
    when('/:countryId', {
      templateUrl: 'home.html',
      controller: 'CountryDetailCtrl'
    }).
	*/
});


// this controller still under construction
jlm.controller('UserNotConnected', function ($scope, countries){
  /*
  countries.list(function(countries) {
    $scope.countries = countries;
  });
  */
});
// this controller still under construction
jlm.controller('UserConnected', function ($scope, $routeParams, countries){
  /*
  countries.find($routeParams.countryId, function(country) {
    $scope.country = country;
  });
  */
});
// this factory still under construction
jlm.factory('countries', function($http){
    var fac = {};
     
    fac.users = ['John', 'James', 'Jake']; 
     
    return fac;
  /*
  return {
    list: function (callback){
      $http({
        method: 'GET',
        url: 'countries.json',
        cache: true
      }).success(callback);
    },
    find: function(id, callback){
      $http({
        method: 'GET',
        url: 'country_' + id + '.json',
        cache: true
      }).success(callback);
    }
  };
  */
});
