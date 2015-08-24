'use strict';

angular.module('fastrankApp')
    .factory('AuthServerProvider', function loginService($http, localStorageService, Base64, ENDPOINT) {
        return {
            login: function(credentials) {
                var data = "username=" + credentials.username + "&password="
                    + credentials.password;
                return $http.post(ENDPOINT + 'api/authenticate', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    }
                }).success(function (response) {
                    localStorageService.set('token', response);
                    return response;
                });
            },
            logout: function() {
                //Stateless API : No server logout
                localStorageService.clearAll();
            },
            getToken: function () {
                return localStorageService.get('token');
            },
            hasValidToken: function () {
                var token = this.getToken();
                return token && token.expires && token.expires > new Date().getTime();
            }
        };
    });
