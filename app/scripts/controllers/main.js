'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('MainCtrl', function ($scope, $location, $cookieStore, $cookies, $rootScope, $window, $state, Auth, Principal, RegisterInterest, ContactUs) {

	$scope.currentPage = $window.location;
	
	$scope.isHome = function(path) { // jshint ignore:line
	    if ($window.location.pathname === '/') {
	      return true;
	    } else {
	      return false;
	    }
	};
	
    Principal.identity().then(function(account) {
        $scope.account = account;
        $rootScope.account = account;
        $scope.isAuthenticated = Principal.isAuthenticated;
    });

	$scope.linkTo = function(id) {
		$location.url(id);
	};
   
	$scope.main = {};
	//$scope.gaId = envConfig.gaId; // jshint ignore:line

	$scope.main.currentuser = null;
	$scope.$parent.main = {};
	//$scope.buildVersion = envConfig.version;

	var sessionCookie = $cookieStore.get('fastrank');
	if (sessionCookie) {
		$scope.$parent.main.currentuser = sessionCookie;
		$scope.main.currentuser = sessionCookie;
	}

	$rootScope.$watch('currentuser', function(newValue, oldValue) { // jshint ignore:line
		$scope.$parent.main.currentuser = newValue;
		$scope.main.currentuser = newValue;
	});
	
    $scope.$watch(function() { return $cookies.cartDomains; }, function() {
        $scope.cartDomains = $cookies.getObject('cartDomains');
        console.log('D> Main cartDomains: ', $scope.cartDomains);
		var creditsTotal = 0;
		if ($scope.cartDomains != null) { //jshint ignore:line
			for(var i = $scope.cartDomains.length - 1; i >= 0; i--) {
				creditsTotal += $scope.cartDomains[i].credits;
			}
			$scope.cartDomains.size = $scope.cartDomains.length;
		} else {
			$scope.cartDomains = [];
			$scope.cartDomains.size = 0;
		}
        $scope.cartDomains.total = creditsTotal;
//        $scope.cartDomains.domains = $scope.cartDomains;
    });

	$scope.logout = function () {
	    Auth.logout();
        $scope.account = null;
        $rootScope.account = null;
        $scope.isAuthenticated = Principal.isAuthenticated;
	    $state.go('home');
	};
	
	$scope.closeCart = function() {
          var element = angular.element('.shopping-cart');
          element.removeClass('open');
	};
	
	$scope.registerInterest = function(interestEmail) {

		RegisterInterest.register(interestEmail).$promise.then(function () {
            $scope.registerInterestError = null;
            $scope.registerInterestSuccess = true;
        }, function () {
            $scope.registerInterestSuccess = null;
            $scope.registerInterestError = true;
        });
	};

	$scope.contactUs = function(contactUsForm) {
		ContactUs.contact(contactUsForm).$promise.then(function () {
            $scope.contactUsError = null;
            $scope.contactUsSuccess = true;
        }).catch(function () {
            $scope.contactUsSuccess = null;
            $scope.contactUsError = true;
        });
	};

  });
