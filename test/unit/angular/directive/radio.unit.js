describe('ionRadio directive', function() {
  var compile, element, scope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
    ionic.Platform.setPlatform('Android');
    spyOn(ionic.Platform, 'ready').andCallFake(function(cb) {
      cb();
    });
  }));
  it('passes ngDisabled attribute', function() {
    var element = compile('<ion-radio ng-disabled="true">')(scope);
    el = element[0].querySelector('input');
    scope.$apply();
    expect(el.disabled)
      .toBe(true);
  });
});