describe('ionNavBackButton directive', function() {
  beforeEach(module('ionic.ui.navBar'));

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

  it('should add onTap if ngClick isnt defined', function() {
    spyOn(ionic, 'on');
    var el = setup();
    expect(ionic.on).toHaveBeenCalledWith(
      'tap',
      el.controller('ionNavBar').back,
      el[0]
    );
  });

  it('should not add onTap if ngClick is defined', function() {
    spyOn(ionic, 'on');
    var el = setup('ng-click="doSomething()"');
    expect(ionic.on).not.toHaveBeenCalled();
  });
});
