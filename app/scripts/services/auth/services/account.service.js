'use strict';

angular.module('fastrankApp')
    .factory('Account', function Account($resource, ENDPOINT) {
        return $resource(ENDPOINT + 'api/public/account', {}, {
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
.factory('UpdateToken', function ($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'api/validate', {}, {
        'POST': { 
        	method: 'POST',
                isArray: false
        }
    });
});
