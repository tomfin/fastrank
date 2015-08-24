'use strict';

angular.module('fastrankApp')
    .controller('ResetCtrl', function ($scope, $stateParams, $timeout, Auth) {
    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.errorProcessing = null;
    $scope.errorEmailNotExists = null;
    $scope.resetPassword = {};
    $timeout(function (){angular.element('[ng-model="resetPassword.email"]').focus();});

    $scope.reset = function () {
        if ($scope.resetPassword.email !== $scope.resetPassword.confirmEmail) {
            $scope.doNotMatch = 'ERROR';
        } else {
            $scope.doNotMatch = null;
            $scope.error = null;
            $scope.errorProcessing = null;
            $scope.errorEmailNotExists = null;

            Auth.sendResetPassword($scope.resetPassword.email).then(function () {
                $scope.success = 'OK';
            }).catch(function (response) {
                $scope.success = null;
                if (response.status === 500 && response.data === 'error resetting password request') {
                    $scope.errorProcessing = 'ERROR';
                } else if (response.status === 404 && response.data === 'e-mail address not found') {
                    $scope.errorEmailNotExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });
        }
    };
});

