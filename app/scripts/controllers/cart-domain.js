'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:cartDomainCtrl
 * @description
 * # cartDomainCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('cartDomainCtrl', ['$scope', '$log', '$stateParams', 'CartDomainSer', 'Summary', 'Links', '$rootScope', 'FastBuy', function ($scope, $log, $stateParams, CartDomainSer, Summary, Links, $rootScope, FastBuy) {
                var summeryDomain = $stateParams.publicId;
                $scope.summary = '';
                $scope.links = '';

                var cartDomains = $rootScope.cartDomains;

                var domains = [];
                angular.forEach(cartDomains, function (value) {
                    this.push(value.publicId);
                }, domains);
                $log.info(domains);

                CartDomainSer.search({ids: {ids: domains}}).$promise.then(function (success) {
                    $log.info('Response:');
                    $log.info(success);
                    $scope.result = success;
                }).catch(function(error) {
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
                    jQuery('html, body').animate({scrollTop: jQuery('.detail-info').offset().top - 65}, 1000); //jshint ignore:line
                };

                if (angular.isDefined(summeryDomain) && summeryDomain !== '') {
                    $scope.detailInfo(summeryDomain);
                }

                $scope.fastBuy = function (result, index) {
                    $log.info(result);
                    $log.info(index);
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
                    jQuery('html, body').delay(1000).animate({scrollTop: jQuery('.error').offset().top - 100}, 1000); //jshint ignore:line
                };

            }]);
