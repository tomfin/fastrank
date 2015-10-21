'use strict';

angular.module('fastrankApp')
.factory('Summary', function Account($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/domains/summary', {}, {
        'get': { 
        	method: 'GET'
        }
    });
});

angular.module('fastrankApp')
.factory('Links', function Account($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/domains/links', {}, {
        'get': { 
        	method: 'GET' 
        }
    });
});


