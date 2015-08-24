'use strict';

angular.module('fastrankApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $state, $timeout, Auth, Principal) {
        $scope.user = {};
        $scope.errors = {};

        $scope.rememberMe = true;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function () {
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                Principal.identity().then(function(account) {
                    $scope.account = account;
                    $scope.isAuthenticated = Principal.isAuthenticated;
                });
                if ($rootScope.previousStateName === 'register') {
                    $state.go('home');
                } else {
                    $rootScope.back();
                }
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };
  });
