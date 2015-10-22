'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
  .controller('searchResultCtrl', ['$scope', '$log', '$stateParams', 'FastBuy', 'Summary', 'Links', function ($scope, $log, $stateParams, FastBuy, Summary, Links) {
    $scope.summery = '';
    $scope.links = '';
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
    
    $scope.fastBuy = function(result, index) {
    	var obj = {};
    	obj.id = result.id;
    	obj.credits = result.credits;
    	FastBuy.buy(obj).$promise.then(function() {
    		$scope.fastBuySuccess = 'SUCCESS';
    		$scope.fastBuyError = null;
    		$scope.result.splice(index, 1);
    	}, function() {
    		$scope.fastBuySuccess = null;
    		$scope.fastBuyError = 'ERROR';
    	});
    };
    $scope.detailInfo = function(id) {
        var domain = {};
        domain.id = id;
        Summary.get(domain).$promise.then(function(summery) {
            $scope.summery = summery;
            $log.info($scope.summery);
        }).catch(function(err) {
            $log.info(err);
        });
        Links.get(domain).$promise.then(function(links) {
            $scope.links = links;
            $log.info($scope.links);
        }).catch(function(err) {
            $log.info(err);
        });

        jQuery('html, body').delay(1000).animate({scrollTop: jQuery('.detail-info').offset().top-65 }, 2000); //jshint ignore:line
    };
}])
.directive('frCollapse', [ function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
        var p = jQuery(element.prev('.domain-row').find('.more-link')); //jshint ignore:line
        p.click(function() {
          jQuery(element).find('.toggle').slideToggle('slow'); //jshint ignore:line
        });
      }
    };
}]);
