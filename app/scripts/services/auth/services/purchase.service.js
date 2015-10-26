'use strict';

angular.module('fastrankApp')
.factory('FastBuy', function Account($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/payment/fastbuy', {}, {
        'buy': { 
        	method: 'POST'
        }
    });
});

angular.module('fastrankApp')
.factory('CheckoutBuy', function Account($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/payment/checkout', {}, {
        'buy': { 
        	method: 'POST'
        }
    });
});

angular.module('fastrankApp')
.factory('Transaction', function Transaction($resource, ENDPOINT) {
	return $resource(ENDPOINT + 'rest-api/domains/transactions', {}, {
		'get': {
			method: 'GET',
			isArray: true
		}
	})
});

angular.module('fastrankApp')
.factory('Domains', function Transaction($resource, ENDPOINT) {
	return $resource(ENDPOINT + 'rest-api/domains/domains', {}, {
		'get': {
			method: 'GET',
			isArray: true
		}
	})
});