describe('Ionic Toggle', function() {
  var el, rootScope, compile;

  beforeEach(module('ionic.ui.toggle'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    el = $compile('<toggle ng-model="data.name"></toggle>')($rootScope);
  }));

  it('Should load', function() {
    var toggleView = el.isolateScope().toggle;
    expect(toggleView).not.toEqual(null);
    expect(toggleView.checkbox).not.toEqual(null);
    expect(toggleView.handle).not.toEqual(null);
  });

  it('Should toggle', function() {
    var toggle = el.isolateScope().toggle;
    expect(toggle.val()).toBe(false);
    el.click();
    expect(toggle.val()).toBe(true);
    el.click();
    expect(toggle.val()).toBe(false);
  });

  it('Should disable and enable', function() {

    el = compile('<toggle ng-model="data.name" ng-disabled="isDisabled"></toggle>')(rootScope);
    var toggle = el.isolateScope().toggle;
    expect(toggle.val()).toBe(false);
    el.click();
    expect(toggle.val()).toBe(true);

    $rootScope.isDisabled = true;
    el.click();
    expect(toggle.val()).toBe(true);

    $rootScope.isDisabled = false;
    el.click();
    expect(toggle.val()).toBe(false);
  });
});
