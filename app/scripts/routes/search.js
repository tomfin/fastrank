'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('search', {
                parent: 'site',
                url: '/search',
                data: {
                    roles: [], 
                    pageTitle: 'search.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/search.html',
                        controller: 'SearchCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('search');
                        return $translate.refresh();
                    }]
                }
            });
    });
