describe('$ionicScroll Controller', function() {

  beforeEach(module('ionic.ui.scroll'));

  var scope, ctrl, timeout;
  function setup(options) {
    options = options || {};

    options.el = options.el || document.createElement('div');

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

  it('should not setup if no child .scroll-refresher', function() {
    setup();
    expect(ctrl.refresher).toBeFalsy();
    spyOn(ctrl.scrollView, 'activatePullToRefresh');
    timeout.flush();
    expect(ctrl.scrollView.activatePullToRefresh).not.toHaveBeenCalled();
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
    scope.$parent.$broadcast = jasmine.createSpy('$broadcast');
    var refresher = ctrl.refresher;

    timeout.flush();

    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    startCb();
    expect(refresher.classList.contains('active')).toBe(true);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    refreshingCb();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    expect(scope.onRefresh).not.toHaveBeenCalled();
    expect(scope.$parent.$broadcast).not.toHaveBeenCalledWith('scroll.onRefresh');

    doneCb();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(true);
    expect(scope.onRefresh).toHaveBeenCalled();
    expect(scope.$parent.$broadcast).toHaveBeenCalledWith('scroll.onRefresh');
  });

});
