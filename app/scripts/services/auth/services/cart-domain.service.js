'use strict';

angular.module('fastrankApp')
.factory('CartDomainSer', function ($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/domains/id', {}, {
        'search': { 
        	method: 'GET',
                isArray: true
        }
    });
});
