describe('ionNavBackButton directive', function() {
  beforeEach(module('ionic'));

  function setup(attr, content) {
    var el;
    inject(function($compile, $rootScope) {
      el = angular.element('<ion-nav-back-button '+(attr||'')+'>'+(content||'')+'</ion-nav-back-button>');
      el.data('$ionNavBarController', {
        back: jasmine.createSpy('back'),
      });
      el = $compile(el)($rootScope.$new());
      $rootScope.$apply();
    });
    return el;
  }

  it('should error without a parent ionNavBar', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-nav-back-button>')($rootScope);
    }).toThrow();
  }));

  it('should should have class', function() {
    var el = setup();
    expect(el.hasClass('button back-button')).toBe(true);
  });

  it('should set hasBackButton through historyChange event', function() {
    var el = setup();
    expect(el.scope().hasBackButton).toBeFalsy();
    el.scope().$parent.$broadcast('$viewHistory.historyChange', {showBack: true});
    expect(el.scope().hasBackButton).toBe(true);
    el.scope().$parent.$broadcast('$viewHistory.historyChange', {showBack: false});
    expect(el.scope().hasBackButton).toBe(false);
  });

  it('should hide based on backButtonShown && hasBackButton', function() {
    var el = setup();
    expect(el.hasClass('hide')).toBe(true);
    el.scope().$apply('backButtonShown = true; hasBackButton = true');
    expect(el.hasClass('hide')).toBe(false);
    el.scope().$apply('backButtonShown = false; hasBackButton = true');
    expect(el.hasClass('hide')).toBe(true);
    el.scope().$apply('backButtonShown = true; hasBackButton = false');
    expect(el.hasClass('hide')).toBe(true);
    el.scope().$apply('backButtonShown = true; hasBackButton = true');
    expect(el.hasClass('hide')).toBe(false);
  });

  it('should transclude content', function() {
    var el = setup('', '<b>content</b> {{1+2}}');
    expect(el.text().trim()).toBe('content 3');
    expect(el.children().eq(0)[0].tagName.toLowerCase()).toBe('b');
  });

  it('should $navBack on click by default', function() {
    var el = setup();
    el.scope().$navBack = jasmine.createSpy('$navBack');
    el.triggerHandler('click');
    expect(el.scope().$navBack).toHaveBeenCalled();
  });

  it('should do ngClick expression if defined', function() {
    var el = setup('ng-click="doSomething()"');
    el.scope().$navBack = jasmine.createSpy('$navBack');
    el.scope().doSomething = jasmine.createSpy('doSomething');
    el.triggerHandler('click');
    expect(el.scope().$navBack).not.toHaveBeenCalled();
    expect(el.scope().doSomething).toHaveBeenCalled();
  });
});
