'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('credits', {
                parent: 'site',
                url: '/credits',
                data: {
                    roles: ['ROLE_CUSTOMER'], 
                    pageTitle: 'credits.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/credits.html',
                        controller: 'CreditsCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('credits');
                        return $translate.refresh();
                    }]
                }
            });
    });
