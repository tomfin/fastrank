'use strict';

angular.module('fastrankApp')
        .config(function ($stateProvider) {
            $stateProvider
                    .state('cart-domain', {
                        parent: 'site',
                        url: '/cart-domain',
                        params: {publicId: ''},
                        data: {
                            roles: [],
                            pageTitle: 'searchResult.title'
                        },
                        views: {
                            'content@': {
                                templateUrl: 'views/cart-domain.html',
                                controller: 'cartDomainCtrl'
                            }
                        }
                    });
        });
