'use strict';

/**
 * @ngdoc function
 * @name fastrankApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the fastrankApp
 */
angular.module('fastrankApp')
        .controller('DomainsCtrl', ['$scope', '$window', 'Domains', 'Summary', 'Links', '$log', function ($scope, $window, Domains, Summary, Links, $log) {

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

                $scope.siteBuild = function (record) {
                    var domain = {};
                    domain.publicId = record.publicId;
                    Domains.build(domain).$promise.then(function () {
                        console.log('D> Build request submitted: ', record.rootURL);
                        $scope.siteBuildSuccess = record.rootURL;
                        $scope.siteBuildFailure = null;
                        Domains.get().$promise.then(function (domainList) {
                            $scope.domains = domainList;
                        });
                    }, function () {
                        $scope.siteBuildSuccess = null;
                        $scope.siteBuildFailure = 'ERROR';
                    });
                };

                $scope.detailInfo = function (publicId) {
                    var domain = {};
                    domain.pur = true;
                    domain.id = publicId;
                    Summary.get(domain).$promise.then(function (summary) {
                        $scope.summary = summary;
                    }).catch(function (err) {
                        $log.error(err);
                    });
                    Links.get(domain).$promise.then(function (links) {
                        $scope.links = links;
                    }).catch(function (err) {
                        $log.error(err);
                    });

                    jQuery('html, body').delay(1000).animate({scrollTop: jQuery('.detail-info').offset().top - 65}, 1000); //jshint ignore:line
                };
            }]);
        
        



