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

  it('should have class', function() {
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

  it('should go back on click by default', function() {
    var el = setup();
    expect(el.controller('ionNavBar').back).not.toHaveBeenCalled();
    el.triggerHandler('click');
    expect(el.controller('ionNavBar').back).toHaveBeenCalled();
  });

  it('should do ngClick expression if defined', function() {
    var el = setup('ng-click="doSomething()"');
    el.scope().$navBack = jasmine.createSpy('$navBack');
    el.scope().doSomething = jasmine.createSpy('doSomething');
    el.triggerHandler('click');
    expect(el.scope().$navBack).not.toHaveBeenCalled();
    expect(el.scope().doSomething).toHaveBeenCalled();
  });


  describe('platforms', function() {
    describe('iOS', function() {
      beforeEach(function($provide) {
        TestUtil.setPlatform('ios');
      });

      it('should not set default back button icon if icon classname exists', function() {
        var el = setup('class="ion-navicon"');
        expect(el.hasClass('ion-ios7-arrow-back')).toBe(false);
      });

      it('should not set default back button icon if icon child exists', function() {
        var el = setup('', '<i class="ion-superstar"></i>');
        expect(el.hasClass('ion-ios7-arrow-back')).toBe(false);
      });

      it('Should set default back button icon from ionicNavBarConfig ', inject(function($ionicNavBarConfig) {
        var el = setup();
        expect(el.hasClass('ion-ios7-arrow-back')).toBe(true);
      }));
    });

    // Android defaults disabled for now
    // describe('android', function() {
    //   beforeEach(function($provide) {
    //     TestUtil.setPlatform('android');
    //   });

    //   it('Should set default back button icon from ionicNavBarConfig ', inject(function($ionicNavBarConfig) {
    //     var el = setup();
    //     expect(el.hasClass('ion-android-arrow-back')).toBe(true);
    //   }));
    // });
  });
});
