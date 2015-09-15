'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('DomainsCtrl', function ($scope, domain, domainStrength, majTF, $q, $timeout) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  $scope.domainStrength = { min: 0, max: 10000, ceil: 10000, floor: 0, step: 100 };
  $scope.majTF = { min: 0, max: 100, ceil: 100, floor: 0, step: 10 };
  $scope.otherSliders = { min: 0, max: 100, ceil: 100, floor: 0, step: 10 };

  $scope.initDomain = function() {
    $scope.updateDomainStrengthSlider($scope.majTF.min, $scope.majTF.max);
    $scope.updatemajTFSlider($scope.majTF.min, $scope.majTF.max);
    getDomains();
  };

  $scope.checkAll = function() {
    if(typeof $scope.selectedAll === "undefined") {
      $scope.selectedAll = true;
    }
    angular.forEach($scope.otherDomains, function (item) {
      item.Selected = $scope.selectedAll;
    });
    $scope.selectedAll = !$scope.selectedAll;
  };

  $scope.selectAllNone = function(status) {
    $scope.selectedCom = status;
    $scope.selectedAll = status;
    angular.forEach($scope.otherDomains, function (item) {
      item.Selected = status;
    });
  };

  $scope.updateDomainStrengthSlider = function(min, max) {
    var domainStrengthDefer = $q.defer();
    domainStrength.get(min, max)
    .success(function (res) {
      domainStrengthDefer.resolve(res);  
    }).error(function () {
      console.log('Error fetching domain strength');
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
      console.log('Error fetching majTF');
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
      console.log('Error fetching domains');
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

  };

  $scope.save = function() {

  };
  
  var reCalSlider = function() {
    $scope.$broadcast('reCalcViewDimensions');
  };
  $timeout(reCalSlider, 2);
})
.factory('domain', function($http) {
  var data = {};
  data.fetchDomains = function() {
    return $http.get('http://ns3006822.ip-151-80-36.eu:8080/rest-api/domains/tlds');
  };
  return data;
})
.factory('domainStrength', function($http) {
  var data = {};
  data.get = function(min, max) {
    return $http.get('http://ns3006822.ip-151-80-36.eu:8080/rest-api/domains/strength?from=' + min + '&to=' + max);
  };
  return data;
})
.factory('majTF', function($http) {
  var data = {};
  data.get = function(min, max) {
    return $http.get('http://ns3006822.ip-151-80-36.eu:8080/rest-api/domains/trustflow?from=' + min + '&to=' + max);
  };
  return data;
});
