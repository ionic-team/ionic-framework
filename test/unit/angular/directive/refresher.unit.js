describe('ionRefresher directive', function() {

  beforeEach(module('ionic'));
  function setup(attrs, scopeProps) {
    var el;
    inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      var ionicScrollCtrl = {
        _setRefresher: jasmine.createSpy('setRefresher'),
        scrollView: {
          finishPullToRefresh: jasmine.createSpy('finishPullToRefresh')
        }
      };

      angular.extend(scope, scopeProps || {});

      el = angular.element('<ion-refresher '+(attrs||'')+'></ion-refresher>');
      el.data('$$ionicScrollController', ionicScrollCtrl);

      $compile(el)(scope);
      ionic.requestAnimationFrame = function() {};
      $rootScope.$apply();
    });
    return el;
  }

  it('should error without ionicScroll', inject(function($compile, $rootScope) {
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

  it('should setRefresher on scrollCtrl', function() {
    var el = setup();
    expect(el.controller('$ionicScroll')._setRefresher.callCount).toBe(1);
    expect(el.controller('$ionicScroll')._setRefresher).toHaveBeenCalledWith(
      el.scope(), el[0]
    );
  });

  it('should listen for scroll.refreshComplete', function() {
    var el = setup();
    el.addClass('active');
    var ctrl = el.controller('$ionicScroll');
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
  it('should have spinner', function() {
    var el = setup('spinner="android"');
    expect(el[0].querySelector('.spinner-android')).toBeTruthy();
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
