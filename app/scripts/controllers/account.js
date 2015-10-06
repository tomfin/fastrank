'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
.controller('AccountCtrl', [ '$scope', '$log', 'Account', '$q', function ($scope, $log, Account, $q) { 
  $scope.accountUpdate = function () {
    $scope.profleUpdateMsg = null;
    var updatedAccount = {};
    updatedAccount.fullName = $scope.account.fullName;
    Account.update(updatedAccount).$promise
    .then(function (res) {
      $scope.profleUpdateMsg = 'Profile is successfully updated.';
    })
    .catch(function () {
      $scope.profleUpdateMsg = 'Error updating profile.';
    });
  };
  
  $scope.changePassword = function() {
    $scope.pswUpdateMsg = null;
    if(angular.isDefined($scope.account.newPassword) && angular.isDefined($scope.account.confirmPassword)) {
      if($scope.account.newPassword === $scope.account.confirmPassword) {
        $scope.doNotMatch = null;
        if(angular.isDefined($scope.account.currentPassword)) {
          $scope.noCurrentPsw = null;
          var updatedAccount = {};
          updatedAccount.currentPassword = $scope.account.currentPassword;
          updatedAccount.newPassword = $scope.account.newPassword;
          Account.update(updatedAccount).$promise
          .then(function (res) {
            $scope.pswUpdateMsg = 'Password is changed successfully.';
          })
          .catch(function () {
            $scope.pswUpdateMsg = 'Error updating password. Please ensure that your current password is correct.';
          });
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