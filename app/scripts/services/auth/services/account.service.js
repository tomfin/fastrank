'use strict';

angular.module('fastrankApp')
    .factory('Account', function Account($resource, ENDPOINT) {
        return $resource(ENDPOINT + 'api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            },
            'update': 
            {
              method: 'POST', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
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