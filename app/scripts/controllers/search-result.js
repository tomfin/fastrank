'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('searchResultCtrl', ['$scope', '$log', '$stateParams', 'FastBuy', 'Summary', 'Links', 'SimpleSearch', 'AdvancedSearch', '$q', '$state', function ($scope, $log, $stateParams, FastBuy, Summary, Links, SimpleSearch, AdvancedSearch, $q, $state) {

                if (!$stateParams.result) {
                    if (angular.isDefined($stateParams.item) && angular.isDefined($stateParams.min) && angular.isDefined($stateParams.max) && angular.isDefined($stateParams.type)) {
                        var simpleSubmit = {};
                        simpleSubmit.item = $stateParams.item;
                        simpleSubmit.max = $stateParams.max;
                        simpleSubmit.min = $stateParams.min;
                        simpleSubmit.type = $stateParams.type;

                        var simpleSearchDefer = $q.defer();
                        SimpleSearch.search(simpleSubmit)
                                .success(function (res) {
                                    simpleSearchDefer.resolve(res);
                                }).error(function (res) {
                            if (res === null) {
                                $scope.searchMsg = 'Error while searching';
                                $log.error('Error while searching');
                            } else if (angular.isDefined(res.status) && res.status === 404) {
                                $scope.searchMsg = 'Sorry, no result found in selected criteria.';
                                $log.error('Sorry, no result found in selected criteria');
                            } else {
                                $scope.searchMsg = 'Error while searching';
                            }
                        });
                        simpleSearchDefer.promise.then(function (res) {
                            simpleSubmit.result = res;
                            $state.go('search-result', simpleSubmit);
                        });
                    } else if (angular.isDefined($stateParams.majTFMin) && angular.isDefined($stateParams.majTFMax) &&
                            angular.isDefined($stateParams.majDOMCFMin) && angular.isDefined($stateParams.majDOMCFMax) &&
                            angular.isDefined($stateParams.majRefDomainsMin) && angular.isDefined($stateParams.majRefDomainsMax) &&
                            angular.isDefined($stateParams.majRefDomainsEDUMin) && angular.isDefined($stateParams.majRefDomainsEDUMax) &&
                            angular.isDefined($stateParams.majRefIPsMin) && angular.isDefined($stateParams.majRefIPsMin) &&
                            angular.isDefined($stateParams.majRefDomainsGOVMin) && angular.isDefined($stateParams.majRefDomainsGOVMax)) {

                        var advancedSubmit = {};

                        if (angular.isDefined($stateParams.comDomains)) {
                            advancedSubmit.comDomains = $stateParams.comDomains;
                        }
                        if (angular.isDefined($stateParams.otherDomains)) {
                            advancedSubmit.otherDomains = $stateParams.otherDomains;
                        }
                        if (angular.isDefined($stateParams.majesticCategory)) {
                            advancedSubmit.majesticCategory = $stateParams.majesticCategory;
                        }
                        if (angular.isDefined($stateParams.majesticSubcategory)) {
                            advancedSubmit.majesticSubcategory = $stateParams.majesticSubcategory;
                        }
                        if (angular.isDefined($stateParams.majesticSubsubcategory)) {
                            advancedSubmit.majesticSubsubcategory = $stateParams.majesticSubsubcategory;
                        }

                        advancedSubmit.majTFMin = $stateParams.majTFMin;
                        advancedSubmit.majTFMax = $stateParams.majTFMax;
                        // CF
                        advancedSubmit.majDOMCFMin = $stateParams.majDOMCFMin;
                        advancedSubmit.majDOMCFMax = $stateParams.majDOMCFMax;
                        // RefDomains
                        advancedSubmit.majRefDomainsMin = $stateParams.majRefDomainsMin;
                        advancedSubmit.majRefDomainsMax = $stateParams.majRefDomainsMax;
                        // RefIPs
                        advancedSubmit.majRefIPsMin = $stateParams.majRefIPsMin;
                        advancedSubmit.majRefIPsMax = $stateParams.majRefIPsMax;
                        // Ref EDU
                        advancedSubmit.majRefDomainsEDUMin = $stateParams.majRefDomainsEDUMin;
                        advancedSubmit.majRefDomainsEDUMax = $stateParams.majRefDomainsEDUMax;
                        // Ref GOV
                        advancedSubmit.majRefDomainsGOVMin = $stateParams.majRefDomainsGOVMin;
                        advancedSubmit.majRefDomainsGOVMax = $stateParams.majRefDomainsGOVMax;

                        var advancedSearchDefer = $q.defer();
                        AdvancedSearch.search(advancedSubmit)
                                .success(function (res) {
                                    advancedSearchDefer.resolve(res);
                                }).error(function () {
                            $log.error('Error while advacned searching');
                        });
                        advancedSearchDefer.promise.then(function (res) {
                            advancedSubmit.result = res;
                            $state.go('search-result', advancedSubmit);
                        });
                    }
                }

                $scope.summery = '';
                $scope.links = '';
                $scope.result = $stateParams.result;
                $scope.parantCheck = '';
                $scope.checkAll = function () {
                    angular.forEach($scope.result, function (obj) {
                        obj.selected = $scope.selectedAll;
                    });
                };
                $scope.toggle = false;
                $scope.moreInfo = function () {
                    $scope.toggle = !$scope.toggle;
                };

                $scope.fastBuy = function (result, index) {
                    var obj = {};
                    obj.id = result.id;
                    obj.credits = result.credits;
                    FastBuy.buy(obj).$promise.then(function () {
                        $scope.fastBuySuccess = 'SUCCESS';
                        $scope.fastBuyError = null;
                        $scope.result.splice(index, 1);
                    }, function () {
                        $scope.fastBuySuccess = null;
                        $scope.fastBuyError = 'ERROR';
                    });
                };
                $scope.detailInfo = function (id) {
                    var domain = {};
                    domain.id = id;
                    Summary.get(domain).$promise.then(function (summery) {
                        $scope.summery = summery;
                        $log.info($scope.summery);
                    }).catch(function (err) {
                        $log.info(err);
                    });
                    Links.get(domain).$promise.then(function (links) {
                        $scope.links = links;
                        $log.info($scope.links);
                    }).catch(function (err) {
                        $log.info(err);
                    });

                    jQuery('html, body').delay(1000).animate({scrollTop: jQuery('.detail-info').offset().top - 65}, 2000); //jshint ignore:line
                };
            }])
        .directive('frCollapse', [function () {
                return {
                    restrict: 'A',
                    link: function (scope, element) {
                        var p = jQuery(element.prev('.domain-row').find('.more-link')); //jshint ignore:line
                        p.click(function () {
                            jQuery(element).find('.toggle').slideToggle('slow'); //jshint ignore:line
                        });
                    }
                };
            }]);
