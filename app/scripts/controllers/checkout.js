'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:CreditsCtrl
 * @description # CreditsCtrl Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('CheckoutCtrl', ['$scope', '$cookies', 'CheckoutBuy', 'GetCart', 'ModifyCart', '$log', function ($scope, $cookies, CheckoutBuy, GetCart, ModifyCart, $log) {

                //$scope.cartDomains = $cookies.getObject('cartDomains');
                $scope.cartDomains = null;
                ModifyCart.cart().$promise.then(function (res) {
                    $scope.cartDomains = res;
                    $log.info(res);
                }).catch(function (err) {
                    $log.info(err);
                });

                var creditsTotal = 0;
                if ($scope.cartDomains != null) { //jshint ignore:line
                    for (var i = $scope.cartDomains.length - 1; i >= 0; i--) {
                        creditsTotal += $scope.cartDomains[i].credits;
                    }
                    $scope.cartDomains.size = $scope.cartDomains.length;
                    $scope.cartDomains.total = creditsTotal;
                }

                $scope.checkout = function () {
                    var domains = [];
                    angular.forEach($scope.cartDomains, function (result) {
                        var obj = {};
                        obj.id = result.id;
                        obj.credits = result.credits;
                        domains.push(obj);
                    });

                    CheckoutBuy.buy(domains).$promise.then(function () {
                        $scope.checkoutBuySuccess = 'SUCCESS';
                        $scope.checkoutBuyError = null;
                        $cookies.putObject('cartDomains', []);
                        $cookies.cartDomains = [];
                    }, function () {
                        $scope.checkoutBuySuccess = null;
                        $scope.checkoutBuyError = 'ERROR';
                    });
                };

                $scope.removeDomain = function (index) {
                    $scope.cartDomains.splice(index, 1);
                    $cookies.putObject('cartDomains', $scope.cartDomains);
                    $cookies.cartDomains = $scope.cartDomains;
                };
            }]);




