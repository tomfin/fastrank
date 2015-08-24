'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('reset', {
                parent: 'site',
                url: '/reset',
                data: {
                    roles: [],
                    pageTitle: 'reset.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/reset.html',
                        controller: 'ResetCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('reset');
                        return $translate.refresh();
                    }]
                }
            });
    });

