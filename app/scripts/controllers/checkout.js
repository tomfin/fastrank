'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
	.controller('CheckoutCtrl', ['$scope', 'CheckoutBuy', 'ModifyCart', '$log', '$rootScope', '$ngBootbox', function ($scope, CheckoutBuy, ModifyCart, $log, $rootScope, $ngBootbox) {
		$scope.cartDomains = $rootScope.cartDomains;
		$scope.removeDomain = function (domain) {
		    angular.forEach($scope.cartDomains, function (obj) {
			if (obj.publicId === domain.publicId) {
			    $scope.cartDomains.splice($scope.cartDomains.indexOf(obj), 1);
			}
		    });

		    ModifyCart.cart($scope.cartDomains).$promise.then(function (res) {
			$rootScope.cartDomains = res;
		    }).catch(function (err) {
			$log.error(err);
		    });
		};

		$scope.checkout = function () {

		    var options = {
			onEscape: true,
			message: 'Please confirm you want to purchase this domain information:',
			title: 'Please confirm!',
			buttons: {
			    warning: {
				label: 'Cancel',
				className: 'btn-warning'
			    },
			    success: {
				label: 'Buy Information',
				className: 'btn-success',
				callback: function () {
				    var domains = [];
				    angular.forEach($scope.cartDomains, function (result) {
					var obj = {};
					obj.publicId = result.publicId;
					obj.credits = result.credits;
					domains.push(obj);
				    });
				    CheckoutBuy.buy(domains).$promise.then(function () {
					$scope.checkoutBuySuccess = 'SUCCESS';
					$scope.checkoutBuyError = null;
					$scope.lowCreditError = null;
					$scope.alreadyPurchased = null;
					angular.forEach(domains, function (obj) {
					    $scope.removeDomain(obj);
					});
				    }, function (res) {
					if (res.status === 402) {
					    $scope.checkoutBuySuccess = null;
					    $scope.checkoutBuyError = null;
					    $scope.lowCreditError = 'ERROR';
					    $scope.alreadyPurchased = null;
					} else if (res.status === 207) {
					    $scope.checkoutBuySuccess = null;
					    $scope.checkoutBuyError = null;
					    $scope.lowCreditError = null;
					    $scope.alreadyPurchased = 'ERROR';
					} else {
					    $scope.checkoutBuySuccess = null;
					    $scope.checkoutBuyError = 'ERROR';
					    $scope.lowCreditError = null;
					    $scope.alreadyPurchased = null;
					}
				    });
				    angular.element('html, body').delay(1000).animate({scrollTop: angular.element('.error').offset().top - 100}, 1000);
				}
			    }
			}
		    };

		    $ngBootbox.customDialog(options);

		};
	    }]);




