describe('Ionic Toggle', function() {
  var el, rootScope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    el = $compile('<ion-toggle ng-model="data.name"></ion-toggle>')($rootScope);
  }));

  it('Should load', function() {
    var toggleView = el.isolateScope().toggle;
    expect(toggleView).not.toEqual(null);
    expect(toggleView.checkbox).not.toEqual(null);
    expect(toggleView.handle).not.toEqual(null);
  });

  it('Should destroy', function() {
    var toggleView = el.isolateScope().toggle;
    spyOn(toggleView, 'destroy');
    el.isolateScope().$destroy();
    expect(toggleView.destroy).toHaveBeenCalled();
  });

  it('Should disable and enable', function() {

    // Init with not disabled
    rootScope.data = { isDisabled: false };
    el = compile('<ion-toggle ng-model="data.name" ng-disabled="data.isDisabled"></ion-toggle>')(rootScope);

    // Grab fields
    var label = el[0].querySelector('label');
    var toggle = el.isolateScope().toggle;
    var input = el[0].querySelector('input');

    // Not disabled, we can toggle
    expect(toggle.val()).toBe(false);
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(true);

    // Disable it
    rootScope.data.isDisabled = true;
    rootScope.$apply();
    expect(input.getAttribute('disabled')).toBe('disabled');

    // We shouldn't be able to toggle it now
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(true);

    // Re-enable it
    rootScope.data.isDisabled = false;
    rootScope.$apply();

    // Should be able to toggle it now
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(false);
    expect(input.getAttribute('disabled')).not.toBe('disabled');
  });

  it('Should toggle', function() {
    var toggle = el.isolateScope().toggle;
    var label = el[0].querySelector('label');
    expect(toggle.val()).toBe(false);
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(true);
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(false);

  });

});
