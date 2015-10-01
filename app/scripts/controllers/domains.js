'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('DomainsCtrl', ['$scope', 'domain', 'domainStrength', 'majTF', 'simpleSearch', '$q', '$timeout', '$log', function ($scope, domain, domainStrength, majTF, simpleSearch, $q, $timeout, $log) {
  $scope.domainStrength = { min: 0, max: 100, ceil: 100, floor: 0, step: 1 };
  $scope.majTF = { min: 0, max: 100, ceil: 100, floor: 0, step: 1 };
  $scope.otherSliders = {
    majDOMCF: { title: 'Maj. Dom CF:0 - 100', min: 0, max: 100, ceil: 100, floor: 0, step: 1 },
    majRefDomians: { title: 'Maj. RefDomains: 0 - Max', min: 0, max: 100, ceil: 100, floor: 0, step: 1 },
    majRefIPs: { title: 'Maj. RefIPs: 0 - Max', min: 0, max: 100, ceil: 100, floor: 0, step: 1 },
    majRefDomainsEDU: { title: 'Maj. RefDomainsEDU: 0 - Max', min: 0, max: 100, ceil: 100, floor: 0, step: 1 },
    majRefDomainGOV: { title: 'Maj. RefDomainGOV: 0 - Max', min: 0, max: 100, ceil: 100, floor: 0, step: 1 }
  };
  $scope.keywords = '';

  $scope.initDomain = function() {
    $scope.updateDomainStrengthSlider($scope.majTF.min, $scope.majTF.max);
    $scope.updatemajTFSlider($scope.majTF.min, $scope.majTF.max);
    getDomains();
  };

  $scope.refreshSlider = function () {
  };
  
  $scope.acc = {};
  $scope.acc.advancedOpen = false;
  $scope.acc.otherMetricsOpen = false;
  
  $scope.$watch('acc', function() {
	 $log.info('D> acc changed: ', $scope.acc); 
     $timeout(function () {
         $scope.$broadcast('rzSliderForceRender');
     });
  }, true);
  
  $scope.selectAllNone = function(status, other) {
    angular.forEach($scope.otherDomains, function (obj) {
        obj.selected = status;
    }); 
    if(angular.isUndefined(other)) {
      $scope.com.selected = status;
      $scope.otherDomains.selected = status;
    }
  };

  $scope.updateDomainStrengthSlider = function(min, max) {
    var domainStrengthDefer = $q.defer();
    domainStrength.get(min, max)
    .success(function (res) {
      domainStrengthDefer.resolve(res);  
    }).error(function () {
      $log.error('Error fetching domain strength');
    });
    domainStrengthDefer.promise.then(function (res) {
      $scope.domainStrength.count = res;
    });
  };

  $scope.updatemajTFSlider = function(min, max) {  
    var majTFDefer = $q.defer();
    majTF.get(min, max)
    .success(function (res) {
      majTFDefer.resolve(res);  
    }).error(function () {
      $log.info('Error fetching majTF');
    });
    majTFDefer.promise.then(function (res) {
      $scope.majTF.count = res;
    });
  };

  var getDomains = function() {  
    var domainDefer = $q.defer();
    domain.fetchDomains()
    .success(function (res) {
      domainDefer.resolve(res);  
    }).error(function () {
      $log.error('Error fetching domains');
    });
    domainDefer.promise.then(function (res) {
      $scope.allDomains = res;
      $scope.otherDomains = angular.copy($scope.allDomains);
      angular.forEach($scope.otherDomains, function (domain, i) {
        if (domain.tld === 'com') {
          $scope.com = {
            tld: domain.tld,
            count: domain.count
          };
          $scope.otherDomains.splice(i, 1);
        } else if(domain.tld === 'All Others') {
          $scope.allOthers = {
            tld: domain.tld,
            count: domain.count
          };  
          $scope.otherDomains.splice(i, 1);
        }
      });
    }); 
  };  

  $scope.find = function() {
    var simpleSearchDefer = $q.defer();
    simpleSearch.search($scope.domainStrength.min, $scope.domainStrength.max, $scope.keywords, 'text')
    .success(function (res) {
      simpleSearchDefer.resolve(res);  
    }).error(function () {
      $log.error('Error while searching');
    });
    simpleSearchDefer.promise.then(function (res) {
      $log.info(res);
    });
  };

  $scope.save = function() {

  };
  
}]);
  


