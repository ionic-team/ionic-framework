describe('Ionic Checkbox', function() {
  var el, scope, compile;

  beforeEach(module('ionic.ui.checkbox'));

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
    var label = el.find('label');
    expect(label.hasClass('checkbox')).toEqual(true);
    var input = el.find('input');
    expect(input.attr('type')).toEqual('checkbox');
    var div = el.find('div');
    expect(div.hasClass('item-content')).toEqual(true);
    expect(div.text()).toEqual('INNER TEXT');
  });

});
