'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('domains', {
                parent: 'site',
                url: '/domains',
                data: {
                    roles: [], 
                    pageTitle: 'domains.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/domains.html',
                        controller: 'DomainsCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('domains');
                        return $translate.refresh();
                    }]
                }
            });
    });
