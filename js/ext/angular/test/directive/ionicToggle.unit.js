describe('Ionic Toggle', function() {
  var el;

  beforeEach(module('ionic.ui.toggle'));

  beforeEach(inject(function($compile, $rootScope) {
    el = $compile('<toggle ng-model="data.name"></toggle>')($rootScope);
  }));

  it('Should load', function() {
    var toggleView = el.scope().toggle;
    expect(toggleView).not.toEqual(null);
    expect(toggleView.checkbox).not.toEqual(null);
    expect(toggleView.track).not.toEqual(null);
    expect(toggleView.handle).not.toEqual(null);
  });

  it('Should toggle', function() {
    var toggle = el.scope().toggle;
    expect(toggle.val()).toBe(false);
    el.click();
    expect(toggle.val()).toBe(true);
    el.click();
    expect(toggle.val()).toBe(false);
  });
});
