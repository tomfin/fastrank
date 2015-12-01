'use strict';

angular.module('fastrankApp')
.factory('CartDomainSer', function ($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/domains/id', {}, {
        'search': { 
        	method: 'POST',
                isArray: true
        }
    });
});

/* To get all the domains which are added into the cart */

angular.module('fastrankApp')
.factory('GetCart', function ($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/domains/cart', {}, {
        'get': { 
        	method: 'GET',
                isArray: true
        }
    });
});

/* To add and remove domains from cart */

angular.module('fastrankApp')
.factory('ModifyCart', function ($resource, ENDPOINT) {
    return $resource(ENDPOINT + 'rest-api/domains/cart', {}, {
        'cart': { 
        	method: 'PUT',
                isArray: true
        }
    });
});

