'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('searchResultCtrl', ['$scope', '$log', '$stateParams', '$cookies', 'FastBuy', 'Summary', 'Links', 'SimpleSearch', 'AdvancedSearch', '$q', '$state', 'GetCart', 'AddToCart', 'RemoveFromCart',
            function ($scope, $log, $stateParams, $cookies, FastBuy, Summary, Links, SimpleSearch, AdvancedSearch, $q, $state, GetCart, AddToCart, RemoveFromCart) {
                $scope.searchMsg = '';

                if (!$stateParams.result) {
                    if (angular.isDefined($stateParams.min) && angular.isDefined($stateParams.max) && angular.isDefined($stateParams.type)) {
                        var simpleSubmit = {};
                        simpleSubmit.item = '';
                        if (angular.isDefined($stateParams.item)) {
                            simpleSubmit.item = $stateParams.item;
                        }
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

                        advancedSubmit.selectedTLDs = [];
                        if (angular.isDefined($stateParams.selectedTLDs)) {
                            if (angular.isArray($stateParams.selectedTLDs)) {
                                angular.forEach($stateParams.selectedTLDs, function (value) {
                                    this.push(value.replace(/dot/gi, '%2E'));
                                }, advancedSubmit.selectedTLDs);
                            } else {
                                advancedSubmit.selectedTLDs.push($stateParams.selectedTLDs.replace(/dot/gi, '%2E'));
                            }
                        }

                        var advancedSearchDefer = $q.defer();
                        AdvancedSearch.search(advancedSubmit)
                                .success(function (res) {
                                    advancedSearchDefer.resolve(res);
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
                        advancedSearchDefer.promise.then(function (res) {
                            advancedSubmit.result = res;
                            $state.go('search-result', advancedSubmit);
                        });
                    }
                } else {
                	$scope.result = $stateParams.result;
                }

                $scope.summary = '';
                $scope.links = '';
                $scope.cartDomains = '';

                $scope.resultInit = function () {
                    /* To get domains which are already added into the cart */
                    GetCart.get().$promise.then(function (res) {
                        $scope.cartDomains = res;
                        $log.info('Domains into cart:');
                        $log.info(res);
                        $scope.result = $stateParams.result;
                        if ($scope.cartDomains != null) { //jshint ignore:line   
                            angular.forEach($scope.result, function (obj) {
                                for (var i = 0; i < $scope.cartDomains.length; i++) {
                                    if (obj.id === $scope.cartDomains[i].publicId) {
                                        obj.selected = true;
                                    }
                                }
                            });
                        }
                    }).catch(function (err) {
                    	console.log('D> GetCart err: ', err);
                        $log.info(err);
                    });
                };
//                $scope.resultInit();

                $scope.parantCheck = '';
                $scope.checkAll = function (status) {
                    angular.forEach($scope.result, function (obj) {
                        obj.selected = status;
                    });
                    $scope.addToCart($scope.result, true);
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
                    Summary.get(domain).$promise.then(function (summary) {
                        $scope.summary = summary;
                    }).catch(function (err) {
                        $log.error(err);
                    });
                    Links.get(domain).$promise.then(function (links) {
                        $scope.links = links;
                    }).catch(function (err) {
                        $log.error(err);
                    });

                    jQuery('html, body').delay(1000).animate({scrollTop: jQuery('.detail-info').offset().top - 65}, 2000); //jshint ignore:line
                };

                var cart = [];
                $scope.addToCart = function (domain, selectAll) {
                	console.log('D> Adding domain: ', domain);
                    if (domain.selected === true || selectAll === true) { // To add into cart
                        if (selectAll === true) {
                            angular.forEach(domain, function (obj) { // if all domains are checked
                                var cartObj = {};
                                cartObj.publicId = obj.id;
                                cartObj.rootURL = obj.rootURL;
                                cartObj.trustFlow = obj.domTF;
                                cartObj.credits = obj.credits;
                                cart.push(cartObj);
                            });
                        } else {  // if a domain is checked
                            var cartObj = {};
                            cartObj.publicId = domain.id;
                            cartObj.rootURL = domain.rootURL;
                            cartObj.trustFlow = domain.domTF;
                            cartObj.credits = domain.credits;
                            cart.push(cartObj);
                        }

                        AddToCart.add(cart).$promise.then(function (res) {
                            $log.info(res);
                        }).catch(function (err) {
                            $log.error(err);
                        });
                    } else if (domain.selected === false || selectAll === false) { // To remove from cart
                        if (selectAll === false) { // if all domains are unchecked
                            $log.info('Empty cart');
                            cart = [];
                        } else { // if a domain is unchecked

                        }
                        RemoveFromCart.remove(cart).$promise.then(function (res) {
                            $log.info(res);
                        }).catch(function (err) {
                            $log.error(err);
                        });
                    }
                    /*for (var i = cartDomains.length - 1; i >= 0; i--) {
                     if (cartDomains[i].id === domain.id) {
                     cartDomains.splice(i, 1);
                     }
                     }*/

                    /*var cartDomains = $cookies.getObject('cartDomains');
                     if (cartDomains == null) { //jshint ignore:line
                     cartDomains = [];
                     }
                     if (domain.selected === true) {
                     var selectedItem = {};
                     selectedItem.id = domain.id;
                     selectedItem.credits = domain.credits;
                     cartDomains.push(selectedItem);
                     $cookies.putObject('cartDomains', cartDomains);
                     $cookies.cartDomains = cartDomains;
                     } else if (domain.selected === false) {
                     for (var i = cartDomains.length - 1; i >= 0; i--) {
                     if (cartDomains[i].id === domain.id) {
                     cartDomains.splice(i, 1);
                     }
                     }
                     $cookies.putObject('cartDomains', cartDomains);
                     $cookies.cartDomains = cartDomains;
                     }*/
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
