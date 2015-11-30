'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('searchResultCtrl', ['$scope', '$rootScope', '$log', '$stateParams', '$q', '$state', 'FastBuy', 'Summary', 'Links', 'SimpleSearch', 'AdvancedSearch', 'ModifyCart', 'Principal',
            function ($scope, $rootScope, $log, $stateParams, $q, $state, FastBuy, Summary, Links, SimpleSearch, AdvancedSearch, ModifyCart, Principal) {
                if (!$stateParams.result || (Principal.isAuthenticated() === true && (!$stateParams.ca || $stateParams.ca.toString() === 'false'))) {

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
                            if (res.status === 404) {
                                $scope.noResultFoundError = 'ERROR';
                                $scope.searchError = null;
                            } else {
                                $scope.searchError = 'ERROR';
                                $scope.noResultFoundError = null;
                            }
                        });
                        simpleSearchDefer.promise.then(function (res) {
                            simpleSubmit.result = res;
                            simpleSubmit.ca = Principal.isAuthenticated();
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
                            if (res.status === 404) {
                                $scope.noResultFoundError = 'ERROR';
                                $scope.searchError = null;
                            } else {
                                $scope.searchError = 'ERROR';
                                $scope.noResultFoundError = null;
                            }
                        });
                        advancedSearchDefer.promise.then(function (res) {
                            advancedSubmit.result = res;
                            advancedSubmit.ca = Principal.isAuthenticated();
                            $state.go('search-result', advancedSubmit);
                        });
                    }
                } else {
                    $scope.result = $stateParams.result;
                }
 
                $scope.summary = '';
                $scope.links = '';
                $scope.resultInit = function () {
                    $scope.cartDomains = $rootScope.cartDomains;
                    $scope.result = $stateParams.result;
                    if ($scope.cartDomains !== null && $scope.cartDomains.length > 0) { 
                        var domainArr = [];
                        var cartArr = [];
                        angular.forEach($scope.result, function (obj) {
                            for (var i = 0; i < $scope.cartDomains.length; i++) {
                                if (obj.publicId === $scope.cartDomains[i].publicId) {
                                    obj.selected = true;
                                } 
                                if(cartArr.indexOf($scope.cartDomains[i].publicId) === -1) {
                                    cartArr.push($scope.cartDomains[i].publicId);
                                }
                            }
                        });
                        
                        angular.forEach($scope.result, function (ele, key) { //jshint ignore:line   
                            domainArr.push($scope.result[key].publicId);
                        });
                        
                        var domainCounter = 0;
                        angular.forEach(domainArr, function (domain, i) {
                            if (cartArr.indexOf(domainArr[i]) > -1) {
                                domainCounter++;
                            }
                        });

                        if (domainCounter === domainArr.length) {
                            $scope.checkAllNone = true;
                        } else {
                            $scope.checkAllNone = false;
                        }
                    } else {
                        $scope.checkAllNone = false;
                    }
                };

                $scope.resultInit();

                $scope.checkAll = function () {
                    var cartArr = [];
                    angular.copy($scope.cartDomains, cartArr);                  
                    $scope.checkAllNone = !$scope.checkAllNone;
                    angular.forEach($scope.result, function (domain) {
                        var dstatus = 1;
                        domain.selected = $scope.checkAllNone;
                        if (domain.selected === true) { // To add into cart
                            if(cartArr.length !== 0) {
                                angular.forEach($scope.cartDomains, function (obj) {
                                    if(obj.publicId === domain.publicId) {
                                        dstatus = 0;       
                                    } 
                                });
                                if(dstatus) {
                                    var cartObj = {};
                                    cartObj.publicId = domain.publicId;
                                    cartObj.rootURL = domain.rootURL;
                                    cartObj.trustFlow = domain.domTF;
                                    cartObj.credits = domain.credits;
                                    $scope.cartDomains.push(cartObj);    
                                }
                            } else {
                                var cartObj = {}; //jshint ignore:line
                                cartObj.publicId = domain.publicId;
                                cartObj.rootURL = domain.rootURL;
                                cartObj.trustFlow = domain.domTF;
                                cartObj.credits = domain.credits;
                                $scope.cartDomains.push(cartObj);
                            }
                        } else if (domain.selected === false) { // To remove from cart
                            angular.forEach($scope.cartDomains, function (obj) {
                                if (obj.publicId === domain.publicId) {
                                    $scope.cartDomains.splice($scope.cartDomains.indexOf(obj), 1);
                                }
                            });
                        }
                    });
                    ModifyCart.cart($scope.cartDomains).$promise.then(function (res) {
                        $rootScope.cartDomains = res;
                    }).catch(function (err) {
                        $log.error(err);
                    });
                };
                $scope.toggle = false;
                $scope.moreInfo = function () {
                    $scope.toggle = !$scope.toggle;
                };

                $scope.addToCart = function (domain) {
                    if (domain.selected === true) { // To add into cart
                        var cartObj = {};
                        cartObj.publicId = domain.publicId;
                        cartObj.rootURL = domain.rootURL;
                        cartObj.trustFlow = domain.domTF;
                        cartObj.credits = domain.credits;
                        $scope.cartDomains.push(cartObj);

                        ModifyCart.cart($scope.cartDomains).$promise.then(function (res) {
                            $rootScope.cartDomains = res;
                            var domainArr = [];
                            var cartArr = [];

                            angular.forEach($scope.result, function (foundDomain) {
                                domainArr.push(foundDomain.publicId);
                            });
                            angular.forEach(res, function (cartDomain) {
                                cartArr.push(cartDomain.publicId);
                            });
                                                        
                            var domainCounter = 0;
                            angular.forEach(domainArr, function(domain, i) {
                                if(cartArr.indexOf(domainArr[i]) > -1) {
                                    domainCounter++; 
                                }
                            });
                            
                            if(domainCounter === domainArr.length) {
                                $scope.checkAllNone = true;
                            } else {
                                $scope.checkAllNone = false;
                            }
                        }).catch(function (err) {
                            $log.error(err);
                        });

                    } else if (domain.selected === false) { // To remove from cart
                        angular.forEach($scope.cartDomains, function (obj) {
                            if (obj.publicId === domain.publicId) {
                                $scope.cartDomains.splice($scope.cartDomains.indexOf(obj), 1);
                            }
                        });

                        ModifyCart.cart($scope.cartDomains).$promise.then(function (res) {
                            $rootScope.cartDomains = res;
                            $scope.checkAllNone = false;
                        }).catch(function (err) {
                            $log.error(err);
                        });

                    }

                };

                $scope.fastBuy = function (result, index) {
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

                $scope.detailInfo = function (publicId) {
                    var domain = {};
                    domain.id = publicId;
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

                    jQuery('html, body').delay(1000).animate({scrollTop: jQuery('.detail-info').offset().top - 65}, 1000); //jshint ignore:line
                };

            }]);
