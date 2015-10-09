'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description
 * # CreditsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('CreditsCtrl', ['$scope', 'STRIPE_KEY', 'Prices', 'Addons', function ($scope, STRIPE_KEY, Prices, Addons) {

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
	  
	$scope.purchase = function() {
		var handler = StripeCheckout.configure({ // jshint ignore:line
			key: STRIPE_KEY, // jshint ignore:line
			image: 'images/qlkto_avatar_square.jpg',
			name: 'Fastrank Ltd',
			description: $scope.submit.tier.name + ' Subscription',
			amount: ($scope.submit.tier.price * 100),
			currency: 'USD',
			panelLabel: 'Top-up',
			email: $scope.submit.user.username,
			allowRememberMe: 'false',
			token: function(token) {
				$scope.card = {};
				$scope.card.tierId = $scope.submit.tier.id;
				$scope.card.tokenId = token.id;
				$scope.card.createdDate = token.created;
				$scope.card.livemode = token.livemode;
				$scope.card.used = token.used;
				$scope.card.type = token.type;
//				PaymentFactory.newCard($scope.card).$promise.then(function() {
//					SharedMessages.setMessage('Congratulations! You\'re now subscribed to the ' + $scope.submit.tier.name + ' plan.');
//					$location.path('/plans');
//				}, function() {
//					$scope.error = 'Something unexpected happened here. Please try again, but if you keep seeing this then let us know!';
//				});
			}
		});

		// Open Checkout with further options
		handler.open({
			name: $scope.submit.tier.name + ' Subscription',
			description: '$' + $scope.submit.tier.price + '.00',
			amount: ($scope.submit.tier.price * 100)
		});
	};
}]);
  


