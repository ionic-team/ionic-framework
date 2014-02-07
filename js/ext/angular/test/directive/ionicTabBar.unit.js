describe('Tab Bar Controller', function() {
  var compile, element, scope, ctrl;

  beforeEach(module('ionic.ui.tabs'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
    var e = compile('<tabs></tabs>')(scope);
    ctrl = e.scope().tabsController;
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
      { title: 'Home', icon: 'icon-home' },
      { title: 'Fun', icon: 'icon-fun' },
      { title: 'Beer', icon: 'icon-beer' },
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

  it('Sets style on child tabs', function() {
    element = compile('<tabs tabs-type="tabs-positive" tabs-style="tabs-icon-bottom">' +
      '<tab active="true" title="Item" icon="icon-default"></tab>' +
      '<tab active="true" title="Item" icon="icon-default"></tab>' +
    '</tabs>')(scope);
    scope.$digest();
    var tabs = element[0].querySelector('.tabs');
    expect(angular.element(tabs).hasClass('tabs-positive')).toEqual(true);
    expect(angular.element(tabs).hasClass('tabs-icon-bottom')).toEqual(true);
  });

  it('Has nav-view', function() {
    element = compile('<tabs>' +
      '<tab active="true" title="Item 1" href="#/page1"><nav-view name="name1"></nav-view></tab>' +
      '<tab active="true" title="Item 2" href="/page2">content2</tab>' +
    '</tabs>')(scope);
    scope = element.scope();
    scope.$digest();
    expect(scope.tabCount).toEqual(2);
    expect(scope.selectedIndex).toEqual(0);
    expect(scope.controllers.length).toEqual(2);
    expect(scope.controllers[0].hasNavView).toEqual(true);
    expect(scope.controllers[0].navViewName).toEqual('name1');
    expect(scope.controllers[0].url).toEqual('/page1');
    expect(scope.controllers[1].hasNavView).toEqual(false);
    expect(scope.controllers[1].url).toEqual('/page2');
  });
});

describe('Tab Item directive', function() {
  var compile, element, scope, ctrl;

  beforeEach(module('ionic.ui.tabs'));

  beforeEach(inject(function($compile, $rootScope, $document, $controller) {
    compile = $compile;
    scope = $rootScope;

    scope.badgeValue = 3;
    scope.badgeStyle = 'badge-assertive';
    element = compile('<tabs>' +
      '<tab title="Item" icon="icon-default" badge="badgeValue" badge-style="{{badgeStyle}}"></tab>' +
      '</tabs>')(scope);
    scope.$digest();
    $document[0].body.appendChild(element[0]);
  }));

  it('Title works', function() {
    //The badge's text gets in the way of just doing .text() on the element itself, so exclude it
    var notBadge = angular.element(element[0].querySelectorAll('a >:not(.badge)'));
    expect(notBadge.text().trim()).toEqual('Item');
  });

  it('Default icon works', function() {
    scope.$digest();
    var i = element[0].querySelectorAll('i')[1];
    expect(angular.element(i).hasClass('icon-default')).toEqual(true);
  });

  it('Badge works', function() {
    scope.$digest();
    var i = element[0].querySelector('.badge');
    expect(i.innerHTML).toEqual('3');
    expect(i.className).toMatch('badge-assertive');
  });

  it('Badge updates', function() {
    scope.badgeValue = 10;
    scope.$digest();
    var i = element[0].querySelectorAll('i')[0];
    expect(i.innerHTML).toEqual('10');
  });

  it('Click sets correct tab index', function() {
    var a = element.find('a:eq(0)');
    var itemScope = a.isolateScope();
    //spyOn(a, 'click');
    spyOn(itemScope, 'selectTab');
    a.click();
    expect(itemScope.selectTab).toHaveBeenCalled();
  });
});

describe('Tab Controller Item directive', function() {
  var compile, element, scope, ctrl;

  beforeEach(module('ionic.ui.tabs'));

  beforeEach(inject(function($compile, $rootScope, $document, $controller) {
    compile = $compile;
    scope = $rootScope;

    scope.badgeValue = 3;
    scope.isActive = false;
    element = compile('<tabs class="tabs">' +
      '<tab-controller-item icon-title="Icon <b>title</b>" icon="icon-class" icon-on="icon-on-class" icon-off="icon-off-class" badge="badgeValue" badge-style="badgeStyle" active="isActive" index="0"></tab-controller-item>' +
    '</tabs>')(scope);
    scope.$digest();
    $document[0].body.appendChild(element[0]);
  }));

  it('Icon title works as html', function() {
    expect(element.find('a').find('span').html()).toEqual('Icon <b>title</b>');
  });

  it('Icon classes works', function() {
    var title = '';
    var elements = element[0].querySelectorAll('.icon-class');
    expect(elements.length).toEqual(1);
    var elements = element[0].querySelectorAll('.icon-off-class');
    expect(elements.length).toEqual(1);
  });

  it('Active switch works', function() {
    var elements = element[0].querySelectorAll('.icon-on-class');
    expect(elements.length).toEqual(0);

    scope.isActive = true;
    scope.$digest();

    var elements = element[0].querySelectorAll('.icon-on-class');
    expect(elements.length).toEqual(1);
  });

  it('Badge updates', function() {
    scope.badgeValue = 10;
    scope.badgeStyle = 'badge-assertive';
    scope.$digest();
    var i = element[0].querySelector('.badge');
    expect(i.innerHTML).toEqual('10');
    expect(i.className).toMatch('badge-assertive');
    scope.$apply('badgeStyle = "badge-super"');
    expect(i.className).toMatch('badge-super');
  });

});
