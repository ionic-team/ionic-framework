describe('Tab Bar Controller', function() {
  var compile, element, scope, ctrl;

  beforeEach(module('ionic.ui.tabbar'));
  
  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
    ctrl = $controller('TabBarCtrl', { $scope: scope, $element: null });
  }));

  it('Select item in controller works', function() {
    ctrl.selectTabAtIndex(1);
    expect(ctrl.getSelectedTabIndex()).toEqual(1);
  });
});

describe('Tab Bar directive', function() {
  var compile, element, scope;

  beforeEach(module('ionic.ui.tabbar'));
  
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
  
  beforeEach(module('ionic.ui.tabbar'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));
  
  it('Has tab class', function() {
    element = compile('<tab-bar><tabs></tabs></tab-bar>')(scope);
    scope.$digest();
    console.log(element);
    expect(element.find('.bar').hasClass('bar-tabs')).toBe(true);
  });
  
  it('Has tab children', function() {
    scope.tabs = [
      { text: 'Home', icon: 'icon-home' },
      { text: 'Fun', icon: 'icon-fun' },
      { text: 'Beer', icon: 'icon-beer' },
    ];
    element = compile('<tab-bar><tabs></tabs></tab-bar>')(scope);
    scope.$digest();
    expect(element.find('li').length).toBe(3);
  });
});

describe('Tab Item directive', function() {
  var compile, element, scope, ctrl;
  
  beforeEach(module('ionic.ui.tabbar'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
    //ctrl = $controller('TabBarCtrl', { $scope: scope, $element: null });

    element = compile('<tab-bar><tabs>' +
      '<tab-item active="true" text="Item" icon="icon-default"></tab-item>' + 
      '</tabs></tab-bar>')(scope);
    scope.$digest();
  }));
  
  it('Default text works', function() {
    expect(element.find('a').first().text()).toEqual('Item');
  });

  it('Default icon works', function() {
    expect(element.find('i').hasClass('icon-default')).toEqual(true);
  });

  it('Click sets correct tab index', function() {
    var a = element.find('a:eq(2)');
    //spyOn(a, 'click');
    spyOn(scope, 'selectTab');
    a.click();
    expect(scope.selectTab).toHaveBeenCalled();
  });
})
