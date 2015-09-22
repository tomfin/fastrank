'use strict';

angular.module('fastrankApp')
.factory('SearchDomain', function ($resource, ENDPOINT) {
  return $resource(ENDPOINT + 'rest-api/domain/search', {}, {
  'search': {
    method: 'GET',
      isArray: true
    }
  });
})
.factory('domain', function($http, ENDPOINT) {
  var data = {};
  data.fetchDomains = function() {
    return $http.get(ENDPOINT + 'rest-api/domains/tlds');
  };
  return data;
})
.factory('domainStrength', function($http, ENDPOINT) {
  var data = {};
  data.get = function(min, max) {
    return $http.get(ENDPOINT + 'rest-api/domains/strength?from=' + min + '&to=' + max);
  };
  return data;
})
.factory('majTF', function($http, ENDPOINT) {
  var data = {};
  data.get = function(min, max) {
    return $http.get(ENDPOINT + 'rest-api/domains/trustflow?from=' + min + '&to=' + max);
  };
  return data;
});