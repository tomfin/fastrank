'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('transactions', {
                parent: 'site',
                url: '/transactions',
                data: {
                    roles: ['ROLE_CUSTOMER'], 
                    pageTitle: 'transactions.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/transactions.html',
                        controller: 'TransactionsCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('transactions');
                        return $translate.refresh();
                    }]
                }
            });
    });
