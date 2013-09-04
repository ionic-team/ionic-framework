describe('Tab Bar Controller', function() {
  var compile, element, scope;

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
  
  //beforeEach(module('ext/angular/tmpl/ionicTabBar.tmpl.html', 'ext/angular/tmpl/ionicTabs.tmpl.html'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('Has section wrapper class', function() {
    element = compile('<tab-bar></tab-bar>')(scope);
    expect(element.hasClass('full-section')).toBe(true);
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
    element = compile('<tabs></tabs>')(scope);
    expect(element.hasClass('bar-tabs')).toBe(true);
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
  
  beforeEach(module('ionic.ui.tabbar'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    scope = $rootScope;
  }));
  
  it('Default text works', function() {
    element = compile('<tab-item></tab-item>')(scope);
    scope.$digest();
    expect(element.find('a').text()).toEqual('Item');
  });

  it('Default icon works', function() {
    element = compile('<tab-item></tab-item>')(scope);
    scope.$digest();
    expect(element.find('i').hasClass('icon-default')).toBeTruthy();
  });
})
