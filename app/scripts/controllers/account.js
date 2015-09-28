'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
.controller('AccountCtrl', [ '$scope', '$log', 'Principal', function ($scope, $log, Principal) {
    var acc = Principal.identity();
    $scope.account = acc.$$state.value;
    $scope.account_update = function () {
      $log.info($scope.account);
    };
}]);
  


