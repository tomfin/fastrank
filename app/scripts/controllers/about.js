'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
