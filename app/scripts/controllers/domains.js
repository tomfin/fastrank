'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('DomainsCtrl', ['$scope', 'Domains', function ($scope, Domains) {

	  $scope.domains = [];
	  Domains.get().$promise.then(function(domainList) {
		  $scope.domains = domainList;
	  });

}]);
  


