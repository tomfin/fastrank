'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:cartDomainCtrl
 * @description
 * # cartDomainCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('cartDomainCtrl', ['$scope', '$log', '$stateParams', '$cookies', 'CartDomainSer', 'Summary', 'Links', '$q', function ($scope, $log, $stateParams, $cookies, CartDomainSer, Summary, Links, $q) {
                var summeryDomain = $stateParams.id;
                $scope.summary = '';
                $scope.links = '';
                
                var cartDomains = $cookies.getObject('cartDomains');

                var domains = [];
                angular.forEach(cartDomains, function (value, key) {
                    this.push(value.id);
                }, domains);
                                
                CartDomainSer.search({ids: {ids: domains}}).
                    $promise.then(
                        function(success) {
                            $scope.result = success;
                        },
                        function(error) {
                            $log.info(error);
                        }
                    );
                
                $scope.detailInfo = function (id) {
                    var domain = {};
                    domain.id = id;
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
                    jQuery('html, body').animate({scrollTop: jQuery('.detail-info').offset().top - 65}, 2000); //jshint ignore:line
                };
                
                if(angular.isDefined(summeryDomain)) {
                    $scope.detailInfo(summeryDomain);
                }
            
            }]);
