describe('$ionicRefresh Controller', function() {

  beforeEach(module('ionic'));
  beforeEach(inject(function($ionicConfig) {
    ionic.Platform.ready = function(cb) { cb(); };
    ionic.requestAnimationFrame = function(cb) { cb(); };
    $ionicConfig.scrolling.jsScrolling(false);
  }));

  function setup(options) {
    options = options || {};
    options.el = options.el ||
      angular.element('<ion-refresher></ion-refresher><div class="list"></div>')[0];
    scrollEl = options.parent ||
      angular.element('<ion-content overflow-scroll="true">');
    scrollEl.append(options.el);

    inject(function($rootScope, $timeout, $compile) {
      scope = $rootScope.$new();

      $compile(scrollEl)(scope);
      scope.$apply();

      refresher = scrollEl.find('.scroll-refresher')[0];
      angular.element(refresher).scope().$onRefresh = jasmine.createSpy('onRefresh');
      angular.element(refresher).scope().$onPulling = jasmine.createSpy('onPulling');
      ctrl = angular.element(refresher).controller('ionRefresher');
      timeout = $timeout;
    });
  }
  function evt(y) {
    return {
      touches: [
        {screenY:y}
      ],
      preventDefault: function() {}
    };
  }

  it('should error if not child of scroll view', function() {
    expect(function() {
      setup({parent: angular.element('<div></div>')});
    }).toThrow();
  });

  it('should oversroll using CSS transforms', function() {
    setup();

    ctrl.__handleTouchmove(evt(0));
    ctrl.__handleTouchmove(evt(10));
    ctrl.__handleTouchmove(evt(20));
    expect(ctrl.__getScrollChild().style[ionic.CSS.TRANSFORM]).toBe('translateY(3px)');
    expect(ctrl.__getScrollChild().classList.contains('overscroll')).toBe(true);
    expect(refresher.classList.contains('invisible')).toBe(false);
  });

  it('should resume native scrolling when overscroll is done', function() {
    setup();
    var domMethods = ctrl.getRefresherDomMethods();
    spyOn(domMethods, 'activate');
    spyOn(domMethods, 'deactivate');

    ctrl.__handleTouchmove(evt(0));
    ctrl.__handleTouchmove(evt(10));
    expect(refresher.classList.contains('invisible')).toBe(false);
    ctrl.__handleTouchmove(evt(0));
    expect(ctrl.__getScrollChild().style[ionic.CSS.TRANSFORM]).toBe('translateY(0px)');
    expect(ctrl.__getScrollChild().classList.contains('overscroll')).toBe(false);
    expect(refresher.classList.contains('invisible')).toBe(true);
  });

  it('should activate and deactivate when dragging past activation threshold', function() {
    setup();
    var domMethods = ctrl.getRefresherDomMethods();
    spyOn(domMethods, 'activate');
    spyOn(domMethods, 'deactivate');

    ctrl.__handleTouchmove(evt(0));
    ctrl.__handleTouchmove(evt(10));
    ctrl.__handleTouchmove(evt(300));
    expect(ctrl.__getScrollChild().style[ionic.CSS.TRANSFORM]).toBe('translateY(96px)');
    expect(ctrl.__getScrollChild().classList.contains('overscroll')).toBe(true);
    expect(refresher.classList.contains('invisible')).toBe(false);
    expect(refresher.classList.contains('active')).toBe(true);

    ctrl.__handleTouchmove(evt(0));
    timeout.flush();
    expect(ctrl.__getScrollChild().style[ionic.CSS.TRANSFORM]).toBe('translateY(0px)');
    expect(ctrl.__getScrollChild().classList.contains('overscroll')).toBe(false);
    expect(refresher.classList.contains('invisible')).toBe(true);
    expect(refresher.classList.contains('active')).toBe(false);
  });

  it('should update refresher class when shared methods fire', function() {
    setup();

    var refresherScope = angular.element(refresher).scope();

    refresherScope.$onRefresh = jasmine.createSpy('onRefresh');
    refresherScope.$onPulling = jasmine.createSpy('onPulling');


    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);
    expect(refresher.classList.contains('invisible')).toBe(true);
    expect(refresherScope.$onRefresh).not.toHaveBeenCalled();
    expect(refresherScope.$onPulling).not.toHaveBeenCalled();

    ctrl.getRefresherDomMethods().show();
    expect(refresher.classList.contains('invisible')).toBe(false);

    ctrl.getRefresherDomMethods().activate();
    expect(refresher.classList.contains('active')).toBe(true);
    expect(refresher.classList.contains('refreshing')).toBe(false);
    expect(refresherScope.$onPulling).toHaveBeenCalled();

    ctrl.getRefresherDomMethods().start();
    expect(refresher.classList.contains('refreshing')).toBe(true);
    expect(refresherScope.$onRefresh).toHaveBeenCalled();

    ctrl.getRefresherDomMethods().tail();
    expect(refresher.classList.contains('refreshing-tail')).toBe(true);

    ctrl.getRefresherDomMethods().deactivate();
    timeout.flush();
    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);
    expect(refresher.classList.contains('refreshing-tail')).toBe(false);

    ctrl.getRefresherDomMethods().hide();
    expect(refresher.classList.contains('invisible')).toBe(true);
  });

  it('should cleanup when done', function() {
    setup();

    expect(ctrl.__getScrollChild()).not.toBe(null);
    expect(ctrl.__getScrollParent()).not.toBe(null);

    scope.$broadcast('$destroy');

    expect(ctrl.__getScrollChild()).toBe(null);
    expect(ctrl.__getScrollParent()).toBe(null);
  });
});
