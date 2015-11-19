'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('CheckoutCtrl', ['$scope', 'CheckoutBuy', 'ModifyCart', '$log', '$rootScope', function ($scope, CheckoutBuy, ModifyCart, $log, $rootScope) {
                $scope.cartDomains = $rootScope.cartDomains;                
                $scope.removeDomain = function (domain) {
                    $log.info($scope.cartDomains);
                    $log.info(domain);
                    angular.forEach($scope.cartDomains, function (obj) {
                        if (obj.publicId === domain.publicId) {
                            $scope.cartDomains.splice($scope.cartDomains.indexOf(obj), 1);
                        }
                    });

                    ModifyCart.cart($scope.cartDomains).$promise.then(function () {
                    }).catch(function (err) {
                        $log.error(err);
                    });
                };

                $scope.checkout = function () {
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
                        angular.forEach(domains, function (obj) {
                            $scope.removeDomain(obj);
                        });
                    }, function () {
                        $scope.checkoutBuySuccess = null;
                        $scope.checkoutBuyError = 'ERROR';
                    });
                };
            }]);




