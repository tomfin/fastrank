'use strict';

angular.module('fastrankApp')
    .factory('Activate', function ($resource, ENDPOINT) {
        return $resource(ENDPOINT + 'api/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    });


