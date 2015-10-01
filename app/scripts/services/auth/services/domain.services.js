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
.factory('Domain', function($http, ENDPOINT) {
  var data = {};
  data.fetchDomains = function() {
    return $http({ url: ENDPOINT+ 'rest-api/domains/tlds', method:"GET" });
  };
  return data;
})
.factory('DomainStrength', function($http, ENDPOINT) {
  var data = {};
  data.get = function(min, max) {
    return $http({ url: ENDPOINT+ 'rest-api/domains/strength', method:"GET", params:{ from:min, to:max } });
  };
  return data;
})
.factory('MajTF', function($http, ENDPOINT) {
  var data = {};
  data.get = function(min, max) {
    return $http({ url: ENDPOINT + 'rest-api/domains/trustflow', method:'GET', params: { from:min, to:max } });
  };
  return data;
})
.factory('SimpleSearch', function($http, ENDPOINT) {
  var data = {};
  data.search = function(min, max, item, type) {
    return $http({ url: ENDPOINT+ 'rest-api/domains/search', method:"GET", params:{ min:min, max:max, item:item, type:type } });
  };
  return data;
});