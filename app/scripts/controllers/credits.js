'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('CreditsCtrl', ['$scope', '$rootScope', '$q', 'STRIPE_KEY', 'Prices', 'Addons', 'PaymentFactory', 'PaypalFactory', 'PaypalToken', function ($scope, $rootScope, $q, STRIPE_KEY, Prices, Addons, PaymentFactory, PaypalFactory, PaypalToken) {

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
		  console.log('D> levelToBuy: ', levelToBuy);
		  console.log('D> inital ppIntegration: ', $scope.ppIntegration);
		  if ($scope.ppIntegration != null) { //jshint ignore:line
			  $scope.ppIntegration.teardown(function () {
				  console.log('D> Braintree teardown called');
			  });
		  }
		  
		  $scope.ppIntegration = null;
		  
		  function asyncGreet() {
			  var deferred = $q.defer();

//			  setTimeout(function() {
				 
			    braintree.setup($scope.token.data, 'paypal', { //jshint ignore:line
			    	onReady: function(integration) {
			    		$scope.ppIntegration = integration;
			    	},
			    	container: 'paypal-container-' + levelToBuy.tierLevel,
		    		singleUse: true,
		    		amount: levelToBuy.price,
		    		description: 'Tom test',
		    		currency: 'USD',
		    		locale: 'en_us',
		    		enableShippingAddress: 'false',
		    		onCancelled: function (obj) {
		    			console.log('D> Tx cancelled: ', obj);
		    		},
			    	onPaymentMethodReceived: function (obj) {
			    		console.log('D> Call server here with nonce: ', obj.nonce);
			    		var payForm = {};
			    		payForm.nonce = obj.nonce;
			    		payForm.amount = levelToBuy.price;
			    		payForm.description = 'Tom test';
			    		payForm.credits = levelToBuy.credits;
			    		PaypalFactory.pay(payForm).$promise.then(function(data) {
			    			console.log('D> Success payment: ', data);
			    			$scope.paymentError = null;
			    			$scope.paymentSuccess = levelToBuy.credits;
			    	    	$scope.$broadcast('paymentcomplete');
			    	    	$scope.ppIntegration = null;
	    	    		}, function(data) {
			    			console.log('D> Failure payment: ', data);
			    			$scope.paymentError = 'ERROR';
			    			$scope.paymentSuccess = null;
			    	    	$scope.$broadcast('paymentcomplete');
			    		});
			    	}
			    });
//			  }, 0);

			  return deferred.promise;
		  }
		  
		  var promise = asyncGreet();
		  promise.then(function() {
			  console.log('Success');
			  $scope.ppIntegration.teardown();
		  }, function(reason) {
			  console.log('Failed: ', reason);
			  $scope.ppIntegration.teardown();
		  });
	  };
	  
	  $scope.launchPaypal = function(levelToBuy) {
		  $scope.selectedLevel = levelToBuy;
		  $scope.paypal(levelToBuy);
	  };
}]);

angular.module('fastrankApp')
.directive('lightbox', function () {
 
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
		
			element.magnificPopup({
				items: {
					src: '#' + attrs.lightbox,
					type: 'inline',
					preloader: false,
					modal: true
				}
			});
		}
	};
});

angular.module('fastrankApp')
.directive('autoClose', ['$timeout', function ($timeout) {
    return {
        link: function ($scope, element) {
            $scope.$on('paymentcomplete', function () {
                $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                	element.trigger('click');
                }, 0, false);
            });
        }
    };
}]);

angular.module('fastrankApp')
.directive('frCollapse', [function () {
	return {
		restrict: 'A',
		link: function (scope, element) {
			var p = jQuery(element.prev().find('td.expandCredit')); //jshint ignore:line
			p.click(function () {
				jQuery(element).find('.toggle').slideToggle('slow'); //jshint ignore:line
			});
		}
	};
}]);
