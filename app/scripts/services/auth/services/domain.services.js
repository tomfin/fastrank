'use strict';

angular.module('fastrankApp')
	.factory('SearchDomain', function ($resource) {
	    return $resource('rest-api/domain/search', {}, {
	    	'search' : {
	    		method: 'GET',
	    		isArray: true
	    	}
	    });
	});
