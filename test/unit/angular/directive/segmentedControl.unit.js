describe('Ionic Segment Control', function() {
  var elm, scope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
    scope.options = ['One', 'Two', 'Three'];
    scope.value = scope.options[0];
    el = compile('<ion-segmented-control ng-model="value" options="options"></ion-segmented-control>')(scope);
    scope.$apply();
  }));

  it('should have 3 elements', function() {
    var buttons = el.find('button');
    expect(buttons.length).toEqual(3);
  });

  it('can select values', function() {
    var buttons = el.find('button');
    expect(buttons.eq(0).hasClass('selected')).toBe(true);
    expect(buttons.eq(1).hasClass('selected')).toBe(false);
    buttons.eq(1).triggerHandler('click');
    scope.$apply();
    expect(buttons.eq(0).hasClass('selected')).toBe(false);
    expect(buttons.eq(1).hasClass('selected')).toBe(true);
  });
});
