describe('Ionic Toggle', function() {
  var el, rootScope, compile;

  beforeEach(module('ionic.ui.toggle'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    el = $compile('<ion-toggle ng-model="data.name"></ion-toggle>')($rootScope);
  }));

  /*
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

    rootScope.data = { isDisabled: false };
    el = compile('<ion-toggle ng-model="data.name" ng-disabled="data.isDisabled"></ion-toggle>')(rootScope);
    var toggle = el.isolateScope().toggle;
    expect(toggle.val()).toBe(false);
    el.click();
    expect(toggle.val()).toBe(true);

    rootScope.data.isDisabled = true;
    rootScope.$apply();
    expect(toggle.el.getAttribute('disabled')).toBe('disabled');
    el.click();
    expect(toggle.val()).toBe(true);

    rootScope.data.isDisabled = false;
    rootScope.$apply();
    el.click();
    expect(toggle.el.getAttribute('disabled')).not.toBe('disabled');
  });
  */

});
