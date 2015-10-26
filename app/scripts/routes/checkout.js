'use strict';

angular.module('fastrankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('checkout', {
                parent: 'site',
                url: '/checkout',
                data: {
                    roles: ['ROLE_CUSTOMER'], 
                    pageTitle: 'checkout.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'views/checkout.html',
                        controller: 'CheckoutCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('checkout');
                        return $translate.refresh();
                    }]
                }
            });
    });
