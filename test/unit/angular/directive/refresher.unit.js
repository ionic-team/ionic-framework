[true, false].forEach(function(jsScrollingEnabled) {
describe('ionRefresher directive', function() {
  beforeEach(module('ionic'));
  beforeEach(inject(function($ionicConfig) {
    $ionicConfig.scrolling.jsScrolling(jsScrollingEnabled);
  }));
  function setup(attrs, scopeProps) {
    var el;
    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();

      angular.extend(scope, scopeProps || {});

      parent = angular.element('<ion-content><ion-refresher '+(attrs||'')+'>');

      //el.data('$$ionicScrollController', ionicScrollCtrl);

      $compile(parent)(scope);
      el = parent.find('.scroll-refresher');
      ionic.requestAnimationFrame = function() {};
      el.refresherCtrl = el.data('$ionRefresherController');
      spyOn(el.controller('$ionicScroll'),'_setRefresher');

      $rootScope.$apply();
    });
    return el;
  }

  it('should error without ionScroll or ionContent', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-refresher>')($rootScope);
    }).toThrow();
  }));

  it('should bind $onRefresh', function() {
    var refreshSpy = jasmine.createSpy('onRefresh');
    var el = setup('on-refresh="refreshSpy()"', {
      refreshSpy: refreshSpy
    });
    expect(refreshSpy).not.toHaveBeenCalled();
    el.scope().$onRefresh();
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should bind $onRefreshOpening', function() {
    var spyMe = jasmine.createSpy('onRefreshOpening');
    var el = setup('on-pulling="spyMe()"', {
      spyMe: spyMe
    });
    expect(spyMe).not.toHaveBeenCalled();
    el.scope().$onPulling();
    expect(spyMe).toHaveBeenCalled();
  });

  it('should listen for scroll.refreshComplete', function() {
    // this is only for js scrolling
    if (!jsScrollingEnabled) return;

    var el = setup();
    el.addClass('active');
    var ctrl = el.controller('$ionicScroll');
    spyOn(ctrl.scrollView, 'finishPullToRefresh');

    expect(ctrl.scrollView.finishPullToRefresh).not.toHaveBeenCalled();
    el.scope().$broadcast('scroll.refreshComplete');
    expect(el.hasClass('active')).toBe(true);
    expect(ctrl.scrollView.finishPullToRefresh).not.toHaveBeenCalled();
    el.scope().$apply();
    expect(ctrl.scrollView.finishPullToRefresh).toHaveBeenCalled();
  });

  it('should not have default pullingIcon', function() {
    var el = setup();
    expect(el[0].querySelector('.icon-pulling .ion-ios-arrow-down')).toBeFalsy();
  });
  it('should allow custom pullingIcon', function() {
    var el = setup('pulling-icon="super-icon"');
    expect(el[0].querySelector('.icon-pulling .ion-arrow-down-c')).toBeFalsy();
    expect(el[0].querySelector('.icon-pulling .super-icon')).toBeTruthy();
  });

  it('should have default spinner', function() {
    var el = setup();
    expect(el[0].querySelector('ion-spinner')).toBeTruthy();
  });
  it('should allow a custom spinner', function() {
    var el = setup('spinner="android"');
    expect(el[0].querySelector('.spinner-android')).toBeTruthy();
  });
  it('should allow spinner to be none', function() {
    var el = setup('spinner="none"');
    expect(el[0].querySelector('ion-spinner')).not.toBeTruthy();
    expect(el[0].querySelector('.icon.icon-refreshing')).not.toBeTruthy();
  });
  it('should allow custom refreshingIcon', function() {
    var el = setup('refreshing-icon="monkey-icon"');
    expect(el[0].querySelector('.icon.icon-refreshing.ion-arrow-down-c')).toBeFalsy();
    expect(el[0].querySelector('.monkey-icon')).toBeTruthy();
  });

  it('should allow pullingText', function() {
    var el = setup('pulling-text="{{2+2}} <b>some</b> text"');
    expect(el[0].querySelector('.text-pulling').innerHTML).toBe('4 <b>some</b> text');
  });
  it('should allow refreshingText', function() {
    var el = setup('refreshing-text="{{3+2}} <b>text</b>"');
    expect(el[0].querySelector('.text-refreshing').innerHTML).toBe('5 <b>text</b>');
  });

  it('should allow pulling rotation animation to be disabled', function() {
    var el = setup('disable-pulling-rotation="true"');
    expect(el[0].querySelector('.pulling-rotation-disabled').innerHTML).toBeTruthy();
  });
});
});
