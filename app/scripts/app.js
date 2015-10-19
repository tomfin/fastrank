'use strict';

/**
 * @ngdoc overview
 * @name fastrankApp
 * @description
 * # fastrankApp
 *
 * Main module of the application.
 */
angular
  .module('fastrankApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router', 
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule', 
    'tmh.dynamicLocale',
    'pascalprecht.translate', 
    'ngCacheBuster', 
    'infinite-scroll',
    'ui.bootstrap',
    'rzModule',
    'braintree-angular'
  ])
  .run(function ($rootScope, $location, $window, $http, $state, $translate, Auth, Principal, Language, ENV, VERSION) {
      $rootScope.ENV = ENV;
      $rootScope.VERSION = VERSION;
      $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
          $rootScope.toState = toState;
          $rootScope.toStateParams = toStateParams;

          if (Principal.isIdentityResolved()) {
              Auth.authorize();
          }

          // Update the language
          Language.getCurrent().then(function (language) {
              $translate.use(language);
          });
      });

      $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
          var titleKey = 'global.title';

          $rootScope.previousStateName = fromState.name;
          $rootScope.previousStateParams = fromParams;

          // Set the page title key to the one configured in state or use default one
          if (toState.data.pageTitle) {
              titleKey = toState.data.pageTitle;
          }
          $translate(titleKey).then(function (title) {
              // Change window title with translated one
              $window.document.title = title;
          });
      });

      $rootScope.back = function() {
          // If previous state is 'activate' or do not exist go to 'home'
          if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
              $state.go('home');
          } else {
              $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
          }
      };
  })
  
  .factory('authInterceptor', function ($rootScope, $q, $location, localStorageService) {
      return {
          // Add authorization token to headers
          request: function (config) {
              config.headers = config.headers || {};
              var token = localStorageService.get('token');
              
              if (token && token.expires && token.expires > new Date().getTime()) {
                config.headers['x-auth-token'] = token.token;
              }
              
              return config;
          }
      };
  })
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider) {

      //Cache everything except rest api requests
      httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*rest-api.*/, /.*protected.*/], true);

      $urlRouterProvider.otherwise('/');

      $stateProvider.state('site', {
          'abstract': true,
          resolve: {
              authorize: ['Auth',
                  function (Auth) {
                      return Auth.authorize();
                  }
              ],
              translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                  $translatePartialLoader.addPart('global');
                  $translatePartialLoader.addPart('language');
                  return $translate.refresh();
              }]
          }
      });

      $httpProvider.interceptors.push('authInterceptor');

      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;

      $locationProvider.html5Mode(true);

      // Initialize angular-translate
      $translateProvider.useLoader('$translatePartialLoader', {
          urlTemplate: 'i18n/{lang}/{part}.json'
      });

      $translateProvider.preferredLanguage('en');
      $translateProvider.useCookieStorage();

      tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
      tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
  })
  .provider('requestNotification', function () {
    // This is where we keep subscribed listeners
    var onRequestStartedListeners = [];
    var onRequestEndedListeners = [];

    // This is a utility to easily increment the request count
    var count = 0;
    var requestCounter = {
        increment: function () {
            count++;
        },
        decrement: function () {
            if (count > 0) { count--; }
        },
        getCount: function () {
            return count;
        }
    };
    // Subscribe to be notified when request starts
    this.subscribeOnRequestStarted = function (listener) {
        onRequestStartedListeners.push(listener);
    };

    // Tell the provider, that the request has started.
    this.fireRequestStarted = function (request) {
        // Increment the request count
        requestCounter.increment();
        //run each subscribed listener
        angular.forEach(onRequestStartedListeners, function (listener) {
            // call the listener with request argument
            listener(request);
        });
        return request;
    };

    // this is a complete analogy to the Request START
    this.subscribeOnRequestEnded = function (listener) {
        onRequestEndedListeners.push(listener);
    };


    this.fireRequestEnded = function () {
        requestCounter.decrement();
        var passedArgs = arguments;
        angular.forEach(onRequestEndedListeners, function (listener) {
            listener.apply(this, passedArgs);
        });
        return arguments[0];
    };

    this.getRequestCount = requestCounter.getCount;

    //This will be returned as a service
    this.$get = function () {
        var that = this;
        // just pass all the 
        return {
            subscribeOnRequestStarted: that.subscribeOnRequestStarted,
            subscribeOnRequestEnded: that.subscribeOnRequestEnded,
            fireRequestEnded: that.fireRequestEnded,
            fireRequestStarted: that.fireRequestStarted,
            getRequestCount: that.getRequestCount
        };
    };
})
.config(function ($httpProvider, requestNotificationProvider) {
    $httpProvider.interceptors.push(function ($q) {
        return {
            request: function (config) {
            	if (config.url.indexOf('rest-api/domains/strength') < 0 && config.url.indexOf('rest-api/domains/trustflow') < 0) {
            		requestNotificationProvider.fireRequestStarted();
            	}
                return config;
            },
            response: function (response) {
                requestNotificationProvider.fireRequestEnded();
                return response;
            },
            
            responseError: function (rejection) {
	            requestNotificationProvider.fireRequestEnded();
	            return $q.reject(rejection);
	        }
	    };
	});
})
.directive('loadingWidget', function (requestNotification) {
    return {
        restrict: 'AC',
        link: function (scope, element) {
            // hide the element initially
            element.hide();

            //subscribe to listen when a request starts
            requestNotification.subscribeOnRequestStarted(function () {
                // show the spinner!
                element.show();
            });

            requestNotification.subscribeOnRequestEnded(function () {
                // hide the spinner if there are no more pending requests
                if (requestNotification.getRequestCount() === 0) { element.hide(); }
            });
        }
    };
});

  
