'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('CheckoutCtrl', ['$scope', '$cookies', 'CheckoutBuy', function ($scope, $cookies, CheckoutBuy) {

  	$scope.cartDomains = $cookies.getObject('cartDomains');
  	
	var creditsTotal = 0;
	if ($scope.cartDomains != null) { //jshint ignore:line
		for(var i = $scope.cartDomains.length - 1; i >= 0; i--) {
			creditsTotal += $scope.cartDomains[i].credits;
		}
		$scope.cartDomains.size = $scope.cartDomains.length;
	}
    $scope.cartDomains.total = creditsTotal;

  	$scope.checkout = function() {
  		CheckoutBuy.buy($scope.cartDomains).$promise.then(function () {
  			$scope.checkoutBuySuccess = 'SUCCESS';
  			$scope.checkoutBuyError = null;
  			$cookies.putObject('cartDomains', null);
  			$cookies.cartDomains = null;
  		}, function () {
  			$scope.checkoutBuySuccess = null;
  			$scope.checkoutBuyError = 'ERROR';
  		});
  	};
	  
  	$scope.removeDomain = function(index) {
  		$scope.cartDomains.splice(index, 1);
  		$cookies.putObject('cartDomains', $scope.cartDomains);
  		$cookies.cartDomains = $scope.cartDomains;
  	};
}]);
