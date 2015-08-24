'use strict';

angular.module('fastrankApp')
    .factory('Password', function ($resource, ENDPOINT) {
        return $resource(ENDPOINT + 'api/account/change_password', {}, {
        });
    })

    .factory('PasswordReset', function($resource, ENDPOINT) {
    	return $resource(ENDPOINT + 'api/account/reset_password', {}, {
    	});
    });
