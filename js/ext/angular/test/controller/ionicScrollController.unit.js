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

  it('should not setup if no child .scroll-refresher', function() {
    setup();
    timeout.flush();
    expect(ctrl.refresher).toBeFalsy();
    spyOn(ctrl.scrollView, 'activatePullToRefresh');
    expect(ctrl.scrollView.activatePullToRefresh).not.toHaveBeenCalled();
  });

  it('should not setup ctrl.refresher until after timeout', function() {
    setup({
      el: angular.element('<div><div class="scroll-refresher"></div></div>')[0]
    });
    expect(ctrl.refresher).toBeUndefined();
    timeout.flush();
    expect(ctrl.refresher).toBe(ctrl.element.children[0]);
  });

  it('should work with .scroll-refresher child and proper refresher', function() {
    var startCb, refreshingCb, doneCb, refresherEl;
    setup({
      el: angular.element('<div><div class="scroll-refresher"></div></div>')[0]
    });
    spyOn(ctrl.scrollView, 'activatePullToRefresh').andCallFake(function(height, start, refreshing, done) {
      startCb = start;
      refreshingCb = refreshing;
      doneCb = done;
    });

    scope.onRefresh = jasmine.createSpy('onRefresh');

    timeout.flush();
    var refresher = ctrl.refresher;

    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    startCb();
    expect(refresher.classList.contains('active')).toBe(true);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    refreshingCb();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    expect(scope.onRefresh).not.toHaveBeenCalled();

    doneCb();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(true);
    expect(scope.onRefresh).toHaveBeenCalled();
  });

});
