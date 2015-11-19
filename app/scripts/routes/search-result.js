'use strict';

angular.module('fastrankApp')
        .config(function ($stateProvider) {
            $stateProvider
                    .state('search-result', {
                        parent: 'site',
                        url: '/search-result?ca&item&max&min&type&comDomains&otherDomains&majesticCategory&majesticSubcategory&majesticSubsubcategory&majTFMin&majTFMax&majDOMCFMin&majDOMCFMax&majRefDomainsMin&majRefDomainsMax&majRefIPsMin&majRefIPsMax&majRefDomainsEDUMin&majRefDomainsEDUMax&majRefDomainsGOVMin&majRefDomainsGOVMax&selectedTLDs',
                        params: {result: ''},
                        data: {
                            roles: [],
                            pageTitle: 'searchResult.title'
                        },
                        views: {
                            'content@': {
                                templateUrl: 'views/search-result.html',
                                controller: 'searchResultCtrl'
                            }
                        },
                        resolve: {
                            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                    $translatePartialLoader.addPart('search-result');
                                    return $translate.refresh();
                                }]
                        }
                    });
        });
