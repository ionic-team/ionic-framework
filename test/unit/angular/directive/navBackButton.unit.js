describe('ionNavBackButton directive', function() {
  beforeEach(module('ionic', function($compileProvider) {
    $compileProvider.directive('needsScroll', function() {
      return {
        //Test if the buttons are 'children of ionScroll' when compiled
        require: '^$ionicScroll',
        link: function(scope, element, attrs, ctrl) {
          element.data('scrollCtrl', ctrl);
        }
      };
    });
  }));

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

  it('ionNavButtons should compile buttons with same scope & access the same data on compile', inject(function($compile, $rootScope) {
    var el = $compile('<div>' +
     '<ion-nav-bar></ion-nav-bar>' +
     '<ion-view>' +
       '<ion-content>' +
         '<ion-nav-buttons side="left">' +
           '<button needs-scroll>Hello!</button>' +
         '</ion-nav-buttons>' +
       '</ion-content>' +
     '</ion-view>' +
    '</div>')($rootScope.$new());
    $rootScope.$apply();
    expect(el.find('ion-content').children().scope())
      .toBe(el.find('.left-buttons button').scope());

    //Test if the button was compiled able to access the parents of ion-nav-buttons
    var scrollCtrl = el.find('ion-content').controller('$ionicScroll');
    expect(scrollCtrl).toBeTruthy();
    expect(el.find('button[needs-scroll]').data('scrollCtrl')).toBe(scrollCtrl);
  }));

  it('should error without a parent ionNavBar', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-nav-back-button>')($rootScope);
    }).toThrow();
  }));

  it('should should have class', function() {
    var el = setup();
    expect(el.hasClass('button back-button')).toBe(true);
  });

  it('should hide based on historyChange', inject(function($rootScope) {
    ionic.animationFrameThrottle = function(cb) { return cb; };
    var el = setup();
    el.scope().backButtonShown = true;
    expect(el.hasClass('ng-hide')).toBe(true);
    $rootScope.$broadcast('$viewHistory.historyChange', {showBack:true});
    el.scope().$apply();
    expect(el.hasClass('ng-hide')).toBe(false);
    $rootScope.$broadcast('$viewHistory.historyChange', {showBack:false});
    el.scope().$apply();
    expect(el.hasClass('ng-hide')).toBe(true);
  }));

  it('should hide based on backButtonShown', inject(function($rootScope) {
    ionic.animationFrameThrottle = function(cb) { return cb; };
    var el = setup();
    expect(el.hasClass('ng-hide')).toBe(true);
    $rootScope.$broadcast('$viewHistory.historyChange', {showBack:true});
    el.scope().$apply('backButtonShown = true');
    expect(el.hasClass('ng-hide')).toBe(false);
    el.scope().$apply('backButtonShown = false');
    expect(el.hasClass('ng-hide')).toBe(true);
    $rootScope.$broadcast('$viewHistory.historyChange', {showBack:false});
    el.scope().$apply('backButtonShown = true');
    expect(el.hasClass('ng-hide')).toBe(true);
    $rootScope.$broadcast('$viewHistory.historyChange', {showBack:true});
    el.scope().$apply('backButtonShown = true');
    expect(el.hasClass('ng-hide')).toBe(false);
  }));

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
