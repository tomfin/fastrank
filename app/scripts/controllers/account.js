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
  $log.info($scope.account);
  $scope.doNotMatch = null;
  $scope.noCurrentPsw = null;
  
  $scope.account_update = function () {   
    //$log.info($scope.account);
  };
  
  $scope.change_password = function() {
    if(angular.isDefined($scope.account.newPassword) && angular.isDefined($scope.account.confirmPassword)) {
      if($scope.account.newPassword === $scope.account.confirmPassword) {
        $scope.doNotMatch = null;
        if(angular.isDefined($scope.account.currentPassword)) {
          $scope.noCurrentPsw = null;
        } else {
          $scope.noCurrentPsw = 'ERROR';
        }
      } else {
        $scope.noCurrentPsw = null;
        $scope.doNotMatch = 'ERROR';
      }
    } else if (angular.isDefined($scope.account.newPassword) && !angular.isDefined($scope.account.confirmPassword)
           || !angular.isDefined($scope.account.newPassword) && angular.isDefined($scope.account.confirmPassword)) {
      $scope.noCurrentPsw = null;
      $scope.doNotMatch = 'ERROR';
    } else {
      $scope.noCurrentPsw = null;
      $scope.doNotMatch = null;
    }
  }
  
}]);
  


