'use strict';

angular.module('fastrankApp')
.factory('Prices', function Account($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/payment/prices', {}, {
        'get': { 
        	method: 'GET', 
        	isArray: true
        }
    });
});

angular.module('fastrankApp')
.factory('Addons', function Account($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/payment/addons', {}, {
        'get': { 
        	method: 'GET', 
        	isArray: true
        }
    });
});

angular.module('fastrankApp')
.factory('PaymentFactory', function($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/payment/stripe/single', {},
        {
            'newCard': {
                method: 'POST'
            }
        });
});

