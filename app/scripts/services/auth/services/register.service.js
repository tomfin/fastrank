'use strict';

angular.module('fastrankApp')
    .factory('Register', function ($resource, ENDPOINT) {
        return $resource(ENDPOINT + 'api/register', {}, {
        });
    });


