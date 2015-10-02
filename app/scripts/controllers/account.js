'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
.controller('AccountCtrl', [ '$scope', '$log', 'Account', function ($scope, $log, Account) {  
  $scope.accountUpdate = function () {   
    var updatedAccount = {};
    $updatedAccount.fullName = $scope.account.fullName;
    Account.update(updatedAccount);
  };
  
  $scope.changePassword = function() {
    if(angular.isDefined($scope.account.newPassword) && angular.isDefined($scope.account.confirmPassword)) {
      if($scope.account.newPassword === $scope.account.confirmPassword) {
        $scope.doNotMatch = null;
        if(angular.isDefined($scope.account.currentPassword)) {
          $scope.noCurrentPsw = null;
          var updatedAccount = {};
          updatedAccount.currentPassword = $scope.account.currentPassword;
          updatedAccount.newPassword = $scope.account.newPassword;
          Account.update(updatedAccount);
        } else {
          $scope.noCurrentPsw = 'ERROR';
        }
      } else {
        $scope.noCurrentPsw = null;
        $scope.doNotMatch = 'ERROR';
      }
    } else if (angular.isDefined($scope.account.newPassword) && !angular.isDefined($scope.account.confirmPassword) || !angular.isDefined($scope.account.newPassword) && angular.isDefined($scope.account.confirmPassword)) {
      $scope.noCurrentPsw = null;
      $scope.doNotMatch = 'ERROR';
    } else {
      $scope.noCurrentPsw = null;
      $scope.doNotMatch = null;
    }
  };
}]);