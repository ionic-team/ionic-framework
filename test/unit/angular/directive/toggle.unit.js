describe('Ionic Toggle', function() {
  var el, rootScope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    el = $compile('<ion-toggle ng-model="data.name"></ion-toggle>')($rootScope);
  }));

  it('Should load', function() {
    var toggleView = el.scope().toggle;
    expect(toggleView).not.toEqual(null);
    expect(toggleView.checkbox).not.toEqual(null);
    expect(toggleView.handle).not.toEqual(null);
  });

  it('Should destroy', function() {
    var toggleView = el.scope().toggle;
    spyOn(toggleView, 'destroy');
    el.scope().$destroy();
    expect(toggleView.destroy).toHaveBeenCalled();
  });

  it('Should disable and enable', function() {

    // Init with not disabled
    rootScope.data = { isDisabled: false };
    el = compile('<ion-toggle ng-model="data.name" ng-disabled="data.isDisabled"></ion-toggle>')(rootScope);

    // Grab fields
    var label = el[0].querySelector('label');
    var toggle = el.scope().toggle;
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
    var toggle = el.scope().toggle;
    var label = el[0].querySelector('label');
    expect(toggle.val()).toBe(false);
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(true);
    ionic.trigger('click', {target: label});
    expect(toggle.val()).toBe(false);
  });

  it('Should have toggle class', function() {

    // Init with not disabled
    rootScope.data = { isDisabled: false };
    el = compile('<ion-toggle toggle-class="toggle-dark" ng-model="data.name" ng-disabled="data.isDisabled"></ion-toggle>')(rootScope);

    // Grab fields
    var label = el.find('label');
    expect(label.hasClass('toggle-dark')).toEqual(true);
  });

  it('Should add config class', inject(function($ionicConfig){
    el = compile('<ion-toggle>')(rootScope);
    expect(el.hasClass('toggle-large')).toBe(true);

    $ionicConfig.form.toggle('small');
    el = compile('<ion-toggle>')(rootScope);
    expect(el.hasClass('toggle-small')).toBe(true);

    $ionicConfig.form.toggle('whatever');
    el = compile('<ion-toggle>')(rootScope);
    expect(el.hasClass('toggle-large')).toBe(false);
    expect(el.hasClass('toggle-sall')).toBe(false);
    expect(el.hasClass('toggle-whatever')).toBe(true);
  }));

});
