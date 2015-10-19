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

angular.module('fastrankApp')
.factory('PaypalToken', function($resource, $http, ENDPOINT) {
    return {
        get: function(credentials) {
        	return $http.get(ENDPOINT + 'rest-api/payment/token');
        }
    }
});

angular.module('fastrankApp')
.factory('PaypalFactory', function($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/payment/paypal/single', {},
        {
            'pay': {
                method: 'POST'
            }
        });
});
