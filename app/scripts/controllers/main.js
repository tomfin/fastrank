'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
	.controller('MainCtrl', function ($log, $scope, $location, $cookieStore, $cookies, $rootScope, $window, $state, Auth, Principal, RegisterInterest, ContactUs, GetCart, localStorageService) {
        
	    $scope.currentPage = $window.location;

	    $scope.isHome = function (path) { // jshint ignore:line
		if ($window.location.pathname === '/') {
		    return true;
		} else {
		    return false;
		}
	    };

	    $scope.getCart = function () {
		$scope.cartDomains = [];
		$rootScope.cartDomains = [];
		/* To get domains which are already added into the cart */
		GetCart.get().$promise.then(function (res) {
		    $scope.cartDomains = res;
		    $rootScope.cartDomains = res;
		}).catch(function () {
		    $rootScope.cartDomains = [];
		});
	    };

	    $scope.accData = Principal;
	    $scope.$watch('accData.isIdentityResolved()', function (newValue, oldValue) { // jshint ignore:line
		if (newValue) {
		    Principal.identity().then(function (account) {
			$scope.account = account;
			$rootScope.account = account;
			$scope.isAuthenticated = Principal.isAuthenticated;
			if ($scope.account) {
			    $scope.getCart();
			}
		    });
		}
	    }, true);

	    $scope.linkTo = function (id) {
		$location.url(id);
	    };

	    $scope.main = {};
	    $scope.main.currentuser = null;
	    $scope.$parent.main = {};
	    //$scope.buildVersion = envConfig.version;

	    var sessionCookie = $cookieStore.get('fastrank');
	    if (sessionCookie) {
		$scope.$parent.main.currentuser = sessionCookie;
		$scope.main.currentuser = sessionCookie;
	    }

	    $rootScope.$watch('currentuser', function (newValue, oldValue) { // jshint ignore:line
		$scope.$parent.main.currentuser = newValue;
		$scope.main.currentuser = newValue;
	    });

	    $scope.$watch(function () {
		return $rootScope.cartDomains;
	    }, function () {
		$scope.cartDomains = $rootScope.cartDomains;
		var creditsTotal = 0;
		if ($scope.cartDomains != null) { //jshint ignore:line
		    for (var i = $scope.cartDomains.length - 1; i >= 0; i--) {
			creditsTotal += $scope.cartDomains[i].credits;
		    }
		    $scope.cartDomains.size = $scope.cartDomains.length;
		} else {
		    $scope.cartDomains = [];
		    $scope.cartDomains.size = 0;
		}
		$scope.cartDomains.total = creditsTotal;
//        $scope.cartDomains.domains = $scope.cartDomains;
	    }, true);

	    $rootScope.$watch(function () {
		return $rootScope.account;
	    }, function () {
		$scope.account = $rootScope.account;
	    }, true);

	    $scope.logout = function () {
		Auth.logout();
		$scope.account = null;
		$rootScope.account = null;
		$scope.isAuthenticated = Principal.isAuthenticated;
		$state.go('home');
	    };

	    $scope.closeCart = function () {
		$scope.hovering = false;
		var element = angular.element('.shopping-cart');
		element.removeClass('open');
	    };

	    $scope.toCheckout = function () {
		$scope.hovering = false;
		$state.go('checkout');
	    };

	    $scope.registerInterest = function (interestEmail) {

		RegisterInterest.register(interestEmail).$promise.then(function () {
		    $scope.registerInterestError = null;
		    $scope.registerInterestSuccess = true;
		}, function () {
		    $scope.registerInterestSuccess = null;
		    $scope.registerInterestError = true;
		});
	    };

	    $scope.contactUs = function (contactUsForm) {
		ContactUs.contact(contactUsForm).$promise.then(function () {
		    $scope.contactUsError = null;
		    $scope.contactUsSuccess = true;
		}).catch(function () {
		    $scope.contactUsSuccess = null;
		    $scope.contactUsError = true;
		});
	    };
	    $scope.config = {
		autoHideScrollbar: false,
		theme: 'rounded-dots-dark',
		advanced: {
		    updateOnContentResize: true
		},
		axis: 'yx', // enable 2 axis scrollbars by default,
		setHeight: 200,
		scrollInertia: 400,
		scrollButtons: {
		    scrollAmount: 'auto', // scroll amount when button pressed
		    enable: true // enable scrolling buttons by default
		}
	    };	    
	    
	    $rootScope.$on('$stateChangeStart', function () {
		var token = localStorageService.get('token');		
		if(angular.isObject(token)) {
		    console.log('Expired on:' + new Date(token.expires));
		    if(token.expires <= Date.now()) {
		    	$log.info('Expired');
		    	$scope.logout();
		    } else {
			var updatedToken = {};
			updatedToken.token = token.token;
			updatedToken.expires = Date.now() + 300000;
			localStorageService.set('token', updatedToken);
			$log.info('Renewed');
			var NewToken = localStorageService.get('token');		
			console.log('New expired on:' + new Date(NewToken.expires));
		    }
		}
	    });
	})
	.directive('frCollapse', [function () {
		return {
		    restrict: 'A',
		    link: function (scope, element) {
			var p = angular.element(element.prev('.domain-row').find('.more-link'));
			p.click(function () {
			    angular.element(element).find('.toggle').slideToggle('slow');
			});
		    }
		};
	    }]);