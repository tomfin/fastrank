'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('TransactionsCtrl', ['$scope', 'Transaction', function ($scope, Transaction) {

	  $scope.transactions = [];
	  Transaction.get().$promise.then(function(transactionList) {
		  $scope.transactions = transactionList;
	  });

}]);
  


