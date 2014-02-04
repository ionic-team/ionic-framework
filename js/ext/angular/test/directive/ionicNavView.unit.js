describe('Ionic nav-view', function() {
  beforeEach(module('ionic.ui.viewState'));

  var compile, scope;
  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
  }));
  
  it('should publish a controller', function() {
    var view = angular.element('<nav-view></nav-view>');
    compile(view)(scope);
    scope.$apply();

    expect(view.controller('navView')).toBeTruthy();
  });

  /*
   * TODO adapt the tests from uiRouter
   */
});
