'use strict';

angular.module('fastrankApp')
	.factory('SearchDomain', function ($resource, ENDPOINT) {
	    return $resource(ENDPOINT + 'rest-api/domain/search', {}, {
	    	'search' : {
	    		method: 'GET',
	    		isArray: true
	    	}
	    });
	});
