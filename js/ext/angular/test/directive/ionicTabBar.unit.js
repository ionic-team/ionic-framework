describe('Tab Bar Controller', function() {
  var compile, element, scope, ctrl;

  beforeEach(module('ionic.ui.tabs'));
  
  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
    ctrl = $controller('TabsCtrl', { $scope: scope, $element: null });
  }));

  it('Select item in controller works', function() {
    ctrl.selectController(1);
    expect(ctrl.getSelectedControllerIndex()).toEqual(1);
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
    expect(element.hasClass('view-wrapper')).toBe(true);
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
    console.log(element);
    expect(element.find('.tabs').hasClass('tabs')).toBe(true);
  });
  
  it('Has tab children', function() {
    scope.tabs = [
      { text: 'Home', icon: 'icon-home' },
      { text: 'Fun', icon: 'icon-fun' },
      { text: 'Beer', icon: 'icon-beer' },
    ];
    element = compile('<tabs></tabs>')(scope);
    scope.$digest();
    expect(element.find('li').length).toBe(3);
  });
});

describe('Tab Item directive', function() {
  var compile, element, scope, ctrl;
  
  beforeEach(module('ionic.ui.tabs'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;

    element = compile('<tabs>' +
      '<tab active="true" text="Item" icon="icon-default"></tab>' + 
      '</tabs>')(scope);
    scope.$digest();
  }));
  
  it('Default text works', function() {
    expect(element.find('a').first().text()).toEqual('Item');
  });

  it('Default icon works', function() {
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
