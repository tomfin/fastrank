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
            }
        });
    });
