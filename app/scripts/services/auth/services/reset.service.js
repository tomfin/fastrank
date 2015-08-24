'use strict';

angular.module('fastrankApp')
    .factory('StartReset', function ($resource, ENDPOINT) {
        return $resource(ENDPOINT + 'api/reset/password', {}, {
            'get': { method: 'GET', isArray: false},
            'send': {method: 'POST'}
        });
    });
