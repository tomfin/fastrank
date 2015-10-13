'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('searchResultCtrl', ['$scope', '$log', '$stateParams', function ($scope, $log, $stateParams) {
    //$log.info($stateParams.result);
    $scope.result = $stateParams.result;
    $scope.parantCheck = '';
    $scope.checkAll = function () {
      angular.forEach($scope.result, function (obj) {
        obj.selected = $scope.selectedAll;
      }); 
    };
    $scope.toggle = false;
    $scope.moreInfo = function() {
      $scope.toggle = !$scope.toggle;
    };
}])
.directive('frCollapse', [ function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
        var p = jQuery(element.prev('.domain-row').find('.more-link'));
        p.click(function($event) {
          jQuery(element).find('.toggle').slideToggle("slow");
        });
      }
    };
}]);
