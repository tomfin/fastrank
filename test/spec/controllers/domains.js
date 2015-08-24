'use strict';

describe('Controller: DomainsCtrl', function () {

  // load the controller's module
  beforeEach(module('fastrankApp'));

  var DomainsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DomainsCtrl = $controller('DomainsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
