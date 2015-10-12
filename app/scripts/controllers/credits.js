'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('CreditsCtrl', ['$scope', '$rootScope', 'STRIPE_KEY', 'Prices', 'Addons', 'PaymentFactory', function ($scope, $rootScope, STRIPE_KEY, Prices, Addons, PaymentFactory) {

	  $scope.prices = [];
	  Prices.get().$promise.then(function(priceList) {
		  console.log('D> priceList: ', priceList);
		  $scope.prices = priceList;
	  });
	  
	  $scope.getAddons = function(level) {
		  Addons.get(level).$promise.then(function(response) {
			  $scope.addons = response;
		  });
	  };
	  
	  $scope.purchase = function(levelToBuy) {
		console.log('D> user login: ', $rootScope.account.login);
		
		var handler = StripeCheckout.configure({ // jshint ignore:line
			key: STRIPE_KEY, // jshint ignore:line
			image: 'images/fastrank_avatar_square.jpg',
			name: 'Fastrank Ltd',
			description: levelToBuy.level + ' level top-up',
			amount: (levelToBuy.price * 100),
			currency: 'USD',
			panelLabel: 'Top-up',
			email: $scope.account.login,
			allowRememberMe: 'false',
			token: function(token) {
				$scope.card = {};
				$scope.card.levelId = levelToBuy.level;
				$scope.card.token = token.id;
				$scope.card.createdDate = token.created;
				$scope.card.livemode = token.livemode;
				$scope.card.used = token.used;
				$scope.card.type = token.type;
				$scope.card.amount = (levelToBuy.price * 100),
				$scope.card.description = levelToBuy.level + ' level top-up'; // jshint ignore:line
				PaymentFactory.newCard($scope.card).$promise.then(function() {
					$scope.paymentError = null;
					$scope.paymentSuccess = levelToBuy.credits;
				}, function() {
					$scope.paymentError = 'ERROR';
					$scope.paymentSuccess = null;
				});
			}
		});
		
		// Open Checkout with further options
		handler.open({
			name: levelToBuy.level + ' level top-up',
			description: '$' + levelToBuy.price,
			amount: (levelToBuy.price * 100)
		});
	  };
	  
	  $scope.purchaseAddon = function(levelToBuy) {
			console.log('D> user login: ', $rootScope.account.login);
			console.log('D> Addon toBuy: ', levelToBuy);
			
			var handler = StripeCheckout.configure({ // jshint ignore:line
				key: STRIPE_KEY, // jshint ignore:line
				image: 'images/fastrank_avatar_square.jpg',
				name: 'Fastrank Ltd',
				description: levelToBuy.parentTierLevelName + ' Addon level ' + levelToBuy.addonLevel + ' top-up',
				amount: (levelToBuy.price * 100),
				currency: 'USD',
				panelLabel: 'Top-up Addon',
				email: $scope.account.login,
				allowRememberMe: 'false',
				token: function(token) {
					$scope.card = {};
					$scope.card.levelId = levelToBuy.level;
					$scope.card.token = token.id;
					$scope.card.createdDate = token.created;
					$scope.card.livemode = token.livemode;
					$scope.card.used = token.used;
					$scope.card.type = token.type;
					$scope.card.amount = (levelToBuy.price * 100),
					$scope.card.description = levelToBuy.parentTierLevelName + 'Addon level ' + levelToBuy.addonLevel + ' top-up'; // jshint ignore:line
					PaymentFactory.newCard($scope.card).$promise.then(function() {
						$scope.paymentError = null;
						$scope.paymentSuccess = levelToBuy.credits;
					}, function() {
						$scope.paymentError = 'ERROR';
						$scope.paymentSuccess = null;
					});
				}
			});
			
			// Open Checkout with further options
			handler.open({
				name: levelToBuy.parentTierLevelName + 'Addon level ' + levelToBuy.addonLevel + ' top-up',
				description: '$' + levelToBuy.price,
				amount: (levelToBuy.price * 100)
			});
	  };
}]);

