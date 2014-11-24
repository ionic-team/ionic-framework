describe('Ionic Checkbox', function() {
  var el, scope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('should set the checkbox name', function() {
    el = compile('<ion-checkbox name="myname"></ion-checkbox>')(scope);
    var input = el.find('input');
    expect(input.attr('name')).toEqual('myname');
  });

  it('should setup checkbox markup', function() {
    el = compile('<ion-checkbox>INNER TEXT</ion-checkbox>')(scope);
    expect(el.hasClass('item')).toEqual(true);
    expect(el.hasClass('item-checkbox')).toEqual(true);
    var label = el.find('div');
    expect(label.hasClass('checkbox')).toEqual(true);
    var input = el.find('input');
    expect(input.attr('type')).toEqual('checkbox');
    var div = el.find('div');
    expect(div.hasClass('item-content')).toEqual(true);
    expect(div.text()).toEqual('INNER TEXT');
  });

  it('should pass down attrs', function() {
    el = compile('<ion-checkbox name="name" ng-model="model" ng-checked="checked" ng-disabled="disabled" ng-true-value="true" ng-false-value="false" ng-change="change">')(scope);
    scope.$apply();
    var input = el.find('input');
    expect(input.attr('name')).toBe('name');
    expect(input.attr('ng-model')).toBe('model');
    expect(input.attr('ng-checked')).toBe('checked');
    expect(input.attr('ng-disabled')).toBe('disabled');
    expect(input.attr('ng-true-value')).toBe('true');
    expect(input.attr('ng-false-value')).toBe('false');
    expect(input.attr('ng-change')).toBe('change');
  });

  it('should ngChecked properly', function() {
    el = compile('<ion-checkbox ng-checked="shouldCheck">')(scope);
    scope.$apply();
    var input = el.find('input');
    expect(input[0].hasAttribute('checked')).toBe(false);
    scope.$apply('shouldCheck = true');
    expect(input[0].hasAttribute('checked')).toBe(true);
    scope.$apply('shouldCheck = false');
    expect(input[0].hasAttribute('checked')).toBe(false);
  });

  it('should ngChange properly', function() {
    el = compile('<ion-checkbox ng-change="change(val)" ng-model="val">')(scope);
    scope.change = jasmine.createSpy('change');
    scope.$apply();
    var input = el.find('input');
    var ngModel = input.controller('ngModel');

    expect(scope.change).not.toHaveBeenCalled();

    ngModel.$setViewValue(true);
    scope.$apply();
    expect(scope.change).toHaveBeenCalledWith(true);

    scope.change.reset();
    ngModel.$setViewValue(false);
    scope.$apply();

    expect(scope.change).toHaveBeenCalledWith(false);
  });

  it('should add config setting class', inject(function($ionicConfig){
    $ionicConfig.form.checkbox('square');
    el = compile('<ion-checkbox>')(scope);
    scope.$apply();
    expect(el[0].querySelector('.checkbox').classList.contains('checkbox-square')).toBe(true);

    $ionicConfig.form.checkbox('circle');
    el = compile('<ion-checkbox>')(scope);
    scope.$apply();
    expect(el[0].querySelector('.checkbox').classList.contains('checkbox-circle')).toBe(true);
  }));

});
