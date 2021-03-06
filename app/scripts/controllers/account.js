'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
.controller('AccountCtrl', [ '$scope', '$rootScope', '$log', 'Account', 'Auth', 'Principal', function ($scope, $rootScope, $log, Account, Auth, Principal) {  
  $scope.updateAccount = {};
  if ($rootScope.account == null) { //jshint ignore:line
	  console.log('W> Null rootScope account - re-fetching.');
		Principal.identity().then(function(account) {
		    $rootScope.account = account;
		    $scope.isAuthenticated = Principal.isAuthenticated;
		});
  }
  $scope.updateAccount.email = $rootScope.account.login;
  $scope.updateAccount.fullName = $rootScope.account.fullName;
  $scope.updateAccount.credits = $rootScope.account.credits;
  $scope.accountUpdate = function () {
    $scope.profleUpdateMsg = null;
    var updatedAccount = {};
    updatedAccount.fullName = $scope.updateAccount.fullName;
    
    Account.update(updatedAccount).$promise
    .then(function () {
      $scope.profleUpdateMsg = 'Profile is successfully updated.';
    })
    .catch(function () {
      $scope.profleUpdateMsg = 'Error updating profile.';
    });
  };
  
  $scope.changePassword = function() {
    $scope.pswUpdateMsg = null;
    if(angular.isDefined($scope.updateAccount.newPassword) && angular.isDefined($scope.updateAccount.confirmPassword)) {
      if($scope.updateAccount.newPassword === $scope.updateAccount.confirmPassword) {
        $scope.doNotMatch = null;
        if(angular.isDefined($scope.updateAccount.currentPassword)) {
          $scope.noCurrentPsw = null;
          var updatedAccount = {};
          updatedAccount.currentPassword = $scope.updateAccount.currentPassword;
          updatedAccount.newPassword = $scope.updateAccount.newPassword;
          Account.update(updatedAccount).$promise
          .then(function (token) {
        	  if (token) {
        		  Auth.login({
        			  username: $rootScope.account.login,
        			  password: updatedAccount.newPassword,
        			  rememberMe: $scope.rememberMe
        		  }).then(function () {
        			  $scope.authenticationError = false;
        		  }).catch(function () {
        			  $scope.authenticationError = true;
        		  });
      		  }
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
    } else if (angular.isDefined($scope.updateAccount.newPassword) && !angular.isDefined($scope.updateAccount.confirmPassword) || !angular.isDefined($scope.updateAccount.newPassword) && angular.isDefined($scope.updateAccount.confirmPassword)) {
      $scope.noCurrentPsw = null;
      $scope.doNotMatch = 'ERROR';
    } else {
      $scope.noCurrentPsw = null;
      $scope.doNotMatch = null;
    }
  };
}]);