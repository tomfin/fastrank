'use strict';

angular.module('fastrankApp')
    .controller('PasswordCtrl', function ($scope, $stateParams, Auth, Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.keyNotFound = null;
        $scope.changePassword = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $scope.doNotMatch = 'ERROR';
            } else {
                $scope.doNotMatch = null;
                if ($stateParams.key != null) { //jshint ignore:line
                    $scope.creds = {};
                    $scope.creds.password = $scope.password;
                    $scope.creds.passwordResetKey = $stateParams.key;
                    Auth.changeLostPassword($scope.creds).then(function() {
                        $scope.error = null;
                        $scope.success = 'OK';
                    }).catch(function() {
                        $scope.success = null;
                        $scope.error = 'ERROR';
                    });
                    $scope.creds = {};
                } else {
                    Auth.changePassword($scope.password).then(function () {
                        $scope.error = null;
                        $scope.success = 'OK';
                    }).catch(function () {
                        $scope.success = null;
                        $scope.error = 'ERROR';
                    });
                }
            }
        };

        console.log('D> Key: ', $stateParams.key);
        if ($stateParams.key != null) { // jshint ignore:line
            Auth.activatePassword({key: $stateParams.key}).then(function (user) {
                console.log('D> Return user: ', user);
                $scope.account = user;
                $scope.error = null;
            }).catch(function (response) {
                $scope.success = null;
                if (response.status === 404) {
                    $scope.keyNotFound = 'ERROR';
                } else {
                   $scope.error = 'ERROR';
                }
            });
        }

    });