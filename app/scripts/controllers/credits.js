'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('CreditsCtrl', ['$scope', '$rootScope', 'STRIPE_KEY', 'Prices', 'Addons', 'PaymentFactory', 'PaypalFactory', 'PaypalToken', function ($scope, $rootScope, STRIPE_KEY, Prices, Addons, PaymentFactory, PaypalFactory, PaypalToken) {

	  $scope.prices = [];
	  Prices.get().$promise.then(function(priceList) {
		  $scope.prices = priceList;
	  });
	  
	  $scope.getAddons = function(level) {
		  Addons.get(level).$promise.then(function(response) {
			  $scope.addons = response;
		  });
	  };
	  
	  PaypalToken.get().then(function(response) {
		  $scope.token = response;
	  });
	  
	  $scope.purchase = function(levelToBuy) {
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
				$scope.card.credits = levelToBuy.credits,
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
					$scope.card.credits = levelToBuy.credits,
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
	  
	  $scope.paypal = function(levelToBuy) {
		  
		  console.log('D> Token: ', $scope.token);
		  
		  braintree.setup($scope.token.data, 'paypal', { //jshint ignore:line
		    container: 'paypal-container',
		    singleUse: true,
		    amount: levelToBuy.price,
		    description: 'Tom test',
		    currency: 'USD',
		    locale: 'en_us',
		    enableShippingAddress: 'false',
		    onPaymentMethodReceived: function (obj) {
		      console.log('D> Call server here with nonce: ', obj.nonce);
		      var payForm = {};
		      payForm.nonce = obj.nonce;
		      payForm.amount = levelToBuy.price;
		      payForm.description = 'Tom test';
		      payForm.credits = levelToBuy.credits;
		      PaypalFactory.pay(payForm).$promise.then(function() {
					$scope.paymentError = null;
					$scope.paymentSuccess = levelToBuy.credits;
		      }, function() {
					$scope.paymentError = 'ERROR';
					$scope.paymentSuccess = null;
		      });
		    }
		  });
	  };
	  
}]);

