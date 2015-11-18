'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('DomainsCtrl', ['$scope', '$window', 'Domains', function ($scope, $window, Domains) {

                $scope.domains = [];
                Domains.get().$promise.then(function (domainList) {
                    $scope.domains = domainList;
                });

                $scope.registrars = [
                    {name: 'Namecheap', value: 'https://www.namecheap.com/?utm_source=none&affnetwork=nc&utm_medium=Affiliate&utm_campaign=91652&domain='},
                    {name: 'GoDaddy', value: 'https://uk.godaddy.com/domains/searchresults.aspx?checkAvail=1&domainToCheck='},
                    {name: 'Scalahosting', value: 'https://www.scalahosting.com/clients/aff.php?aff=365&domain='},
                    {name: 'BigRock', value: 'http://www.bigrock.com/?a_aid=vbn6gj6aDzs85&domain='}
                ];


                $scope.redirectToRegistrar = function (registrar, domain) {
                    $window.open(registrar.value + domain, '_new');
                };

                $scope.sort = {
                    column: '',
                    descending: false
                };

                $scope.changeSorting = function (column) {
                    console.log(column);
                    var sort = $scope.sort;

                    if (sort.column === column) {
                        console.log('if');
                        sort.descending = !sort.descending;
                    } else {
                        console.log('else');
                        sort.column = column;
                        sort.descending = false;
                    }
                };
                
                $scope.siteBuild = function (record) {
                	console.log('D> Site build for rec: ', record);
                	Domains.build(record).$promise.then(function () {
                		console.log('D> Build request submitted');
                	});
                };

            }]);



