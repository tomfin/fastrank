'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:cartDomainCtrl
 * @description
 * # cartDomainCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
	.controller('cartDomainCtrl', ['$scope', '$log', '$stateParams', 'CartDomainSer', 'Summary', 'Links', '$rootScope', 'FastBuy', '$ngBootbox', '$location',  function ($scope, $log, $stateParams, CartDomainSer, Summary, Links, $rootScope, FastBuy, $ngBootbox, $location) {
		var summeryDomain = $stateParams.publicId;
		$scope.summary = '';
		$scope.links = '';

		var cartDomains = $rootScope.cartDomains;

		var domains = [];
		angular.forEach(cartDomains, function (value) {
		    this.push(value.publicId);
		}, domains);

		CartDomainSer.search({ids: domains}).$promise.then(function (success) {
		    $scope.result = success;
		}).catch(function (error) {
		    $log.error(error);
		});

		$scope.detailInfo = function (publicId) {
		    var domain = {};
		    domain.id = publicId;
		    Summary.get(domain).$promise.then(function (summary) {
			$scope.summary = summary;
		    }).catch(function (err) {
			$log.info(err);
		    });
		    Links.get(domain).$promise.then(function (links) {
			$scope.links = links;
		    }).catch(function (err) {
			$log.info(err);
		    });
		    angular.element('html, body').animate({scrollTop: angular.element('.detail-info').offset().top - 65}, 1000);
		};

		if (angular.isDefined(summeryDomain) && summeryDomain !== '') {
		    $scope.detailInfo(summeryDomain);
		} else {
                    $location.path('checkout');
                }

		$scope.fastBuy = function (result, index) {
		    var options = {
			onEscape: true,
			message: 'Please confirm you want to FastBuy this domain',
			title: 'Please confirm!',
			buttons: {
			    warning: {
				label: 'Cancel',
				className: 'btn-warning'
			    },
			    success: {
				label: 'Buy domain',
				className: 'btn-success',
				callback: function () {
				    var obj = {};
				    obj.publicId = result.publicId;
				    obj.credits = result.credits;
				    FastBuy.buy(obj).$promise.then(function () {
					$scope.fastBuySuccess = 'SUCCESS';
					$scope.fastBuyError = null;
					$scope.lowCreditError = null;
					$scope.result.splice(index, 1);
				    }, function (res) {
					if (res.status === 402) {
					    $scope.fastBuySuccess = null;
					    $scope.fastBuyError = null;
					    $scope.lowCreditError = 'ERROR';
					} else {
					    $scope.fastBuySuccess = null;
					    $scope.fastBuyError = 'ERROR';
					    $scope.lowCreditError = null;
					}
				    });
				    angular.element('html, body').delay(1000).animate({scrollTop: angular.element('.error').offset().top - 100}, 1000);
				}
			    }
			}
		    };
		    $ngBootbox.customDialog(options);
		};
		// For basic and advance accordians
		$scope.oneAtATime = true;
		$scope.accordian1 = {open: true};
	    }]);
