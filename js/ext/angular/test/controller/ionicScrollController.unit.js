describe('$ionicScroll Controller', function() {

  beforeEach(module('ionic'));

  var scope, ctrl, timeout;
  function setup(options) {
    options = options || {};

    options.el = options.el ||
      //scrollView requires an outer container element and a child
      //content element
      angular.element('<div><div></div></div>')[0];

    inject(function($controller, $rootScope, $timeout) {
      scope = $rootScope.$new();
      ctrl = $controller('$ionicScroll', {
        $scope: scope,
        scrollViewOptions: options
      });
      spyOn(ctrl.scrollView, 'run'); // don't actually call run, this is a dumb test
      timeout = $timeout;
    });
  }

  it('should set this.$scope', function() {
    setup();
    //Just an arbitrary way of checking that it is indeed a scope
    expect(typeof ctrl.$scope.$id).toBe('string');
  });

  it('should set $scope.$$ionicScrollController', function() {
    setup();
    expect(ctrl.$scope.$$ionicScrollController).toBe(ctrl);
  });

  it('should set this.element and this.$element', function() {
    setup();
    expect(ctrl.element.tagName).toMatch(/div/i);
    expect(ctrl.$element[0]).toBe(ctrl.element);
  });

  it('should register scrollView as this.scrollView', function() {
    setup();
    expect(ctrl.scrollView instanceof ionic.views.Scroll).toBe(true);
  });

  it('should register controller on element.data', function() {
    setup();
    expect(ctrl.$element.controller('$ionicScroll')).toBe(ctrl);
  });

  it('should run after a timeout', function() {
    setup();
    timeout.flush();
    expect(ctrl.scrollView.run).toHaveBeenCalled();
  });

  it('should resize the scrollview on window resize', function() {
    setup();
    timeout.flush();
    spyOn(ctrl.scrollView, 'resize');
    ionic.trigger('resize', { target: window });
    expect(ctrl.scrollView.resize).toHaveBeenCalled();
  });

  it('should remember scroll position on $viewContentLoaded event', function() {
    var historyData = { rememberedScrollValues: { left: 1, top: 2 } };
    setup();
    spyOn(ctrl.scrollView, 'scrollTo');
    scope.$broadcast('$viewContentLoaded', historyData);
    timeout.flush();
    expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(1, 2);

    spyOn(ctrl.scrollView, 'getValues').andCallFake(function() {
      return {
        left: 33,
        top: 44
      };
    });
    scope.$broadcast('$destroy');
    expect(historyData.rememberedScrollValues).toEqual({
      left: 33,
      top: 44
    });
  });

  it('should unbind window event listener on scope destroy', function() {
    spyOn(window, 'removeEventListener');
    spyOn(window, 'addEventListener');
    setup();
    expect(window.addEventListener).toHaveBeenCalled();
    expect(window.addEventListener.mostRecentCall.args[0]).toBe('resize');
    scope.$destroy();
    expect(window.removeEventListener).toHaveBeenCalled();
    expect(window.removeEventListener.mostRecentCall.args[0]).toBe('resize');
  });

  it('should register with $ionicScrollDelegate', inject(function($ionicScrollDelegate) {
    spyOn($ionicScrollDelegate, 'register');
    setup();
    expect($ionicScrollDelegate.register).toHaveBeenCalledWith(scope, ctrl.$element, ctrl.scrollView);
  }));

  it('should not activatePullToRefresh if setRefresher is not called', function() {
    setup();
    timeout.flush();
    expect(ctrl.refresher).toBeFalsy();
    spyOn(ctrl.scrollView, 'activatePullToRefresh');
    expect(ctrl.scrollView.activatePullToRefresh).not.toHaveBeenCalled();
  });

  it('should activatePullToRefresh and work when setRefresher', function() {
    var startCb, refreshingCb, doneCb, refresherEl;
    setup({
      el: angular.element('<div><div class="scroll-refresher"></div></div>')[0]
    });
    spyOn(ctrl.scrollView, 'activatePullToRefresh').andCallFake(function(height, start, refreshing, done) {
      startCb = start;
      refreshingCb = refreshing;
      doneCb = done;
    });
    ctrl.setRefresher(scope, ctrl.element);

    var scrollOnRefreshSpy = jasmine.createSpy('scroll.onRefresh');

    scope.$onRefresh = jasmine.createSpy('onRefresh');
    scope.$onPulling = jasmine.createSpy('onPulling');

    timeout.flush();
    var refresher = ctrl.refresher;

    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    startCb();
    expect(refresher.classList.contains('active')).toBe(true);
    expect(refresher.classList.contains('refreshing')).toBe(false);
    expect(scope.$onPulling).toHaveBeenCalled();

    refreshingCb();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    expect(scope.$onRefresh).not.toHaveBeenCalled();

    doneCb();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(true);
    expect(scope.$onRefresh).toHaveBeenCalled();
  });

});
