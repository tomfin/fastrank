'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account', {
                parent: 'site',
                url: '/account',
                data: {
                    roles: ['ROLE_CUSTOMER'],
                    pageTitle: 'account.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/account.html',
                        controller: 'AccountCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            });
    });
