'use strict';

angular.module('fastrankApp')
	.factory('RegisterInterest', function ($resource, ENDPOINT) {
	    return $resource(ENDPOINT + 'rest-api/contact/register', {}, {
	    	'register' : {
	    		method: 'POST'
	    	}
	    });
	})
	.factory('ContactUs', function ($resource, ENDPOINT) {
	    return $resource(ENDPOINT + 'rest-api/contact/us', {}, {
	    	'contact' : {
	    		method: 'POST'
	    	}
	    });
	});


angular.module('fastrankApp')
.factory('HideSource', function($resource, ENDPOINT) {
	return $resource(ENDPOINT + 'rest-api/source/hide', {}, {
		'hide': {
			method: 'POST'
		}
	});
});