describe('Tab Bar Controller', function() {
  var compile, element, scope, ctrl;

  beforeEach(module('ionic.ui.tabs'));
  
  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
    ctrl = $controller('TabsCtrl', { $scope: scope, $element: null });
  }));

  it('Select item in controller works', function() {
    // Verify no items selected
    expect(ctrl.getSelectedControllerIndex()).toEqual(undefined);

    // Try selecting beyond the bounds
    ctrl.selectController(1);
    expect(ctrl.getSelectedControllerIndex()).toEqual(undefined);

    // Add a controller
    ctrl.add({
      title: 'Cats',
      icon: 'icon-kitty-kat'
    });

    expect(ctrl.getSelectedControllerIndex()).toEqual(0);

    ctrl.add({
      title: 'Cats',
      icon: 'icon-kitty-kat'
    });

    expect(ctrl.getSelectedControllerIndex()).toEqual(0);

    ctrl.select(1);

    expect(ctrl.getSelectedControllerIndex()).toEqual(1);
  });

  it('Calls change callback', function() {
    scope.onControllerChanged = function(oldC, oldI, newC, newI) {
    };

    // Add a controller
    ctrl.add({
      title: 'Cats',
      icon: 'icon-kitty-kat'
    });
    ctrl.add({
      title: 'Dogs',
      icon: 'icon-rufus'
    });

    spyOn(ctrl, 'controllerChanged');

    expect(ctrl.getSelectedControllerIndex()).toEqual(0);
    ctrl.select(1);

    expect(ctrl.controllerChanged).toHaveBeenCalled();
  });
});

describe('Tab Bar directive', function() {
  var compile, element, scope;

  beforeEach(module('ionic.ui.tabs'));
  
  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('Has section wrapper class', function() {
    element = compile('<tab-bar></tab-bar>')(scope);
    expect(element.hasClass('tabs')).toBe(true);
  });
});

describe('Tabs directive', function() {
  var compile, element, scope;
  
  beforeEach(module('ionic.ui.tabs'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));
  
  it('Has tab class', function() {
    element = compile('<tabs></tabs>')(scope);
    scope.$digest();
    expect(element.find('.tabs').hasClass('tabs')).toBe(true);
  });
  
  it('Has tab children', function() {
    element = compile('<tabs></tabs>')(scope);
    scope = element.scope();
    scope.controllers = [
      { text: 'Home', icon: 'icon-home' },
      { text: 'Fun', icon: 'icon-fun' },
      { text: 'Beer', icon: 'icon-beer' },
    ];
    scope.$digest();
    expect(element.find('a').length).toBe(3);
  });

  it('Has compiled children', function() {
    element = compile('<tabs>' + 
      '<tab active="true" title="Item" icon="icon-default"></tab>' + 
      '<tab active="true" title="Item" icon="icon-default"></tab>' + 
    '</tabs>')(scope);
    scope.$digest();
    expect(element.find('a').length).toBe(2);
  });
});

describe('Tab Item directive', function() {
  var compile, element, scope, ctrl;
  
  beforeEach(module('ionic.ui.tabs'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;

    element = compile('<tabs>' +
      '<tab title="Item" icon="icon-default"></tab>' + 
      '</tabs>')(scope);
    scope.$digest();
  }));
  
  it('Default text works', function() {
    console.log(element);
    expect(element.find('a').first().text().trim()).toEqual('Item');
  });

  it('Default icon works', function() {
    console.log(element);
    scope.$digest();
    expect(element.find('i').hasClass('icon-default')).toEqual(true);
  });

  it('Click sets correct tab index', function() {
    var a = element.find('a:eq(0)');
    var itemScope = a.scope();
    //spyOn(a, 'click');
    spyOn(itemScope, 'selectTab');
    a.click();
    expect(itemScope.selectTab).toHaveBeenCalled();
  });
});
