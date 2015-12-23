'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
	.controller('searchResultCtrl', ['$scope', '$rootScope', '$log', '$stateParams', '$q', '$state', 'FastBuy', 'Summary', 'Links', 'SimpleSearch', 'AdvancedSearch', 'ModifyCart', 'Principal', '$ngBootbox', 'localStorageService', '$window',
	    function ($scope, $rootScope, $log, $stateParams, $q, $state, FastBuy, Summary, Links, SimpleSearch, AdvancedSearch, ModifyCart, Principal, $ngBootbox, localStorageService, $window) {
		
		var token = localStorageService.get('token');
		$scope.summary = '';
		$scope.links = '';
		$scope.result = [];

		var adjustPageNo = function (pageNo) {
		    if (pageNo >= 0) {
			return pageNo;
		    } else {
			return 0;
		    }
		};

		var domainSearch = function (pageNo, pageSize) {
		    if (angular.isDefined($stateParams.min) && angular.isDefined($stateParams.max) && angular.isDefined($stateParams.type)) {
			var simpleSubmit = {};
			simpleSubmit.item = '';
			if (angular.isDefined($stateParams.item)) {
			    simpleSubmit.item = $stateParams.item;
			}
			simpleSubmit.max = $stateParams.max;
			simpleSubmit.min = $stateParams.min;
			simpleSubmit.type = $stateParams.type;
			simpleSubmit.pageNo = pageNo;
			simpleSubmit.pageSize = pageSize;

			var simpleSearchDefer = $q.defer();
			SimpleSearch.search(simpleSubmit)
				.success(function (res) {
				    simpleSearchDefer.resolve(res);
				}).error(function (res) {
			    if (res.status === 404) {
				$scope.noResultFoundError = 'ERROR';
				$scope.searchError = null;
			    } else if(res.status === 400) {
				$scope.searchError = null;
				$scope.noResultFoundError = null;
				$scope.noResultFoundAlchemy = 'Error';
			    } else {
				$scope.searchError = 'ERROR';
				$scope.noResultFoundError = null;
			    }
			});
			simpleSearchDefer.promise.then(function (res) {
			    angular.copy(res, $scope.result);
			    $scope.addAllStatus();	
			    var totalFound = true;
			    for(var i = 0; i < $scope.result.length; i++) {
				if (totalFound) {
				    $scope.totalItems = $scope.result[i].totalCount;
				    totalFound = false;
				    break;
				}
			    }
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
			advancedSubmit.pageNo = pageNo;
			advancedSubmit.pageSize = pageSize;
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
			    angular.copy(res, $scope.result);
			    $scope.addAllStatus();
			    var totalFound = true;
			    for(var i = 0; i < $scope.result.length; i++) {
				if (totalFound) {
				    $scope.totalItems = $scope.result[i].totalCount;
				    totalFound = false;
				    break;
				}
			    }
			});
		    }
		    $scope.summary = '';
		    $scope.links = '';
		    angular.element('html, body').delay(1000).animate({scrollTop: angular.element('.error').offset().top - 100}, 1000);
		};

		if (!$stateParams.result || (Principal.isAuthenticated().toString() === 'true' && $stateParams.result && $stateParams.result[0].credits === 0)) {
		    domainSearch(adjustPageNo($stateParams.pageNo - 1), $stateParams.pageSize);
		} else {
		    $scope.result = $stateParams.result;
		    var totalFound = true;
		    for(var i = 0; i < $scope.result.length; i++) {
			if (totalFound) {
			    $scope.totalItems = $scope.result[i].totalCount;
			    totalFound = false;
			    break;
			}
		    }
		}
		
		$scope.addAllStatus = function () {
		    $scope.cartDomains = $rootScope.cartDomains;
		    if ($stateParams.result) {
			$scope.result = $stateParams.result;
		    }
		    if (angular.isDefined($scope.cartDomains)) {
			var domainArr = [];
			var cartArr = [];
			angular.forEach($scope.result, function (obj) {
			    for (var i = 0; i < $scope.cartDomains.length; i++) {
				if (obj.publicId === $scope.cartDomains[i].publicId) {
				    obj.selected = true;
				}
				if (cartArr.indexOf($scope.cartDomains[i].publicId) === -1) {
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
		    }
		};

		if ($stateParams.result) {
		    $scope.addAllStatus();
		}

		$scope.checkAll = function () {
		    if(Date.now() >= token.expires) {	
		       $window.location.reload();
		    }
		    var cartArr = [];
		    angular.copy($scope.cartDomains, cartArr);
		    $scope.checkAllNone = !$scope.checkAllNone;
		    angular.forEach($scope.result, function (domain) {
			var dstatus = 1;
			domain.selected = $scope.checkAllNone;
			if (domain.selected === true) { // To add into cart
			    if (cartArr.length !== 0) {
				angular.forEach($scope.cartDomains, function (obj) {
				    if (obj.publicId === domain.publicId) {
					dstatus = 0;
				    }
				});
				if (dstatus) {
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
		    if(Date.now() >= token.expires) {	
		       $window.location.reload();
		    }
		    
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

		    angular.element('html, body').delay(1000).animate({scrollTop: angular.element('.detail-info').offset().top - 65}, 1000); 
		};

		$scope.pageSizeRanges = [20, 30, 40, 50, 100];
		$scope.maxPage = 10;

		if ($stateParams.pageNo) {
		    $scope.pageNo = parseInt($stateParams.pageNo);
		} else {
		    $scope.pageNo = 0;
		}

		if ($stateParams.pageSize) {
		    $scope.pageSize = parseInt($stateParams.pageSize);
		} else {
		    $scope.pageSize = 20;
		}

		$scope.setRecordLimit = function (limit) {
		    $scope.pageSize = limit;
		    $scope.pageNo = 0;
		    domainSearch(adjustPageNo(0), $scope.pageSize);
		};

		$scope.paginate = function () {
		    domainSearch(adjustPageNo($scope.pageNo - 1), $scope.pageSize);
		};
		$scope.summeryAccordianStatus = {open: true};
                // For basic and advance accordians
		$scope.oneAtATime = true;
		$scope.accordian1 = {open: true};
	    }]);
