describe('ionicInfiniteScroll directive', function() {
  beforeEach(module('ionic'));
  var scrollTopValue  = 50;
  var scrollTopMaxValue = 60;
  var scrollLeftValue = 101;
  var scrollLeftMaxValue = 121;
  var ctrl;
  function setupJS(attrs, scopeProps, options) {
    var element;
    inject(function($rootScope, $compile) {
      var scope = $rootScope.$new();
      angular.extend(scope, scopeProps || {});
      element = angular.element('<ion-infinite-scroll ' + (attrs || '') + '></ion-infinite-scroll>');
      ionic.animationFrameThrottle = function(cb) { return function() { cb(); }; };
      element.data('$$ionicScrollController', {
        scrollView: {
          options: angular.extend({
            scrollingX: true,
            scrollingY: true
          }, options || {}),
          getValues: jasmine.createSpy('getValues').andCallFake(function() {
            return {
              left: scrollLeftValue,
              top: scrollTopValue
            };
          }),
          getScrollMax: jasmine.createSpy('getScrollMax').andCallFake(function() {
            return {
              left: scrollLeftMaxValue,
              top: scrollTopMaxValue
            };
          }),
          resize: jasmine.createSpy('resize')
        },
        resize: jasmine.createSpy('resize'),
        $element: angular.element('<div>'),
        isNative: function() {return false;}
      });
      $compile(element)(scope);
      ionic.requestAnimationFrame = function() {};
      ctrl = element.controller('ionInfiniteScroll');
      scope.$apply();
    });
    return element;
  }

  function setupNative(attrs, scopeProps, options) {
    var element, parent;
    inject(function($rootScope, $compile, $document) {
      var scope = $rootScope.$new();
      angular.extend(scope, scopeProps || {});
      parent = angular.element('<ion-content class="overflow-scroll" overflow-scroll="true">' +
                               '<ion-infinite-scroll ' + (attrs || '') +
                               '></ion-infinite-scroll></ion-content>');
      if (options && !!options.scrollingX) parent[0].style['overflow-x'] ='scroll';
      if (options && !!options.scrollingY) parent[0].style['overflow-y'] ='scroll';

      ionic.animationFrameThrottle = function(cb) { return function() { cb(); }; };
      $compile(parent)(scope);
      element = parent.find('ion-infinite-scroll');
      ionic.requestAnimationFrame = function() {};
      ctrl = element.controller('ionInfiniteScroll');

      // create a fake scrollEl since they can't be faked if we're passing in scroll data
      if (options) {
        ctrl.scrollEl = {style:{
          'overflow-x':'hidden',
          'overflow-y':'hidden'
        }};
        if (!!options.scrollingX) ctrl.scrollEl.style['overflow-x'] ='scroll';
        if (!!options.scrollingY) ctrl.scrollEl.style['overflow-y'] ='scroll';
        ctrl.scrollEl.clientWidth = ctrl.scrollEl.scrollLeft = scrollLeftValue;
        ctrl.scrollEl.clientHeight = ctrl.scrollEl.scrollTop = scrollTopValue;
        ctrl.scrollEl.scrollWidth = scrollLeftMaxValue;
        ctrl.scrollEl.scrollHeight = scrollTopMaxValue;
      }

      scope.$apply();
    });

    return element;
  }

  it('should error if no ionicScroll or native scroll parent', function() {
    expect(function() {
      inject(function($compile, $rootScope) {
        $compile('<ion-infinite-scroll></ion-infinite-scroll>')($rootScope.$new());
      });
    }).toThrow();
  });

  it('should not have class or be loading by default', function() {
    ionic.requestAnimationFrame = function() {};
    var el = setupJS();
    expect(el.hasClass('active')).toBe(false);
    expect(ctrl.isLoading).toBe(false);

    el = setupNative();
    expect(el.hasClass('active')).toBe(false);
    expect(ctrl.isLoading).toBe(false);
  });

  it('should unbind scroll event on destroy', function() {
    var el = setupJS();
    spyOn(el.controller('$ionicScroll').$element, 'off');
    el.scope().$destroy();
    expect(el.controller('$ionicScroll').$element.off).toHaveBeenCalledWith('scroll', jasmine.any(Function));

    el = setupNative();
    spyOn(ctrl.scrollEl, 'removeEventListener');
    el.scope().$destroy();
    expect(ctrl.scrollEl.removeEventListener).toHaveBeenCalled();
  });

  describe('icon', function() {
    it('should have platform appropriate default spinner', function() {
      var el = setupJS();
      var icon = angular.element(el[0].querySelector('.spinner'));
      if (ionic.Platform.isAndroid()) {
        expect(icon[0].className.indexOf('spinner-android')).not.toBe(-1);
      }else {
        expect(icon[0].className.indexOf('spinner-ios')).not.toBe(-1);
      }
    });

    it('should allow icon attr blank', function() {
      var el = setupJS('icon=""');
      var icon = angular.element(el[0].querySelector('.spinner'));
      if (ionic.Platform.isAndroid()) {
        expect(icon[0].className.indexOf('spinner-android')).not.toBe(-1);
      }else {
        expect(icon[0].className.indexOf('spinner-ios')).not.toBe(-1);
      }
    });

    it('should allow interpolated icon attr', function() {
      var el = setupJS('icon="{{someIcon}}"');
      var icon = angular.element(el[0].querySelector('.icon'));
      expect(icon.hasClass('ion-load-d')).toBe(false);
      el.scope().$apply('someIcon = "super-icon"');
      expect(icon.hasClass('super-icon')).toBe(true);
    });

    it('should allow interpolated spinner attr', function() {
      var el = setupJS('spinner="lines"');
      var icon = angular.element(el[0].querySelector('.spinner'));
      expect(icon[0].className.indexOf('lines')).not.toBe(-1);
    });
  });

  describe('getMaxScroll', function() {
    [{ scrollingX: true,  scrollingY: true },
     { scrollingX: false, scrollingY: true },
     { scrollingX: true,  scrollingY: false }
    ].forEach(function(opts) {

      describe('with scrollingX=' + opts.scrollingX + ', scrollingY=' + opts.scrollingY, function() {
        it('should default to 2.5%', function() {
          setupJS('', {}, opts);
          expect(ctrl.getJSMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue * 0.975 : -1,
            top: opts.scrollingY ? scrollTopMaxValue * 0.975 : -1
          });

          setupNative('', {}, opts);
          var tmp = window.getComputedStyle;
          window.getComputedStyle = function() {return {};};
          expect(ctrl.getNativeMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue * 0.975 : -1,
            top: opts.scrollingY ? scrollTopMaxValue * 0.975 : -1
          });
          window.getComputedStyle = tmp;
        });

        it('should use attr.distance as number', function() {
          setupJS('distance=3', {}, opts);
          expect(ctrl.getJSMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue - 3 : -1,
            top: opts.scrollingY ? scrollTopMaxValue - 3 : -1
          });

          setupNative('distance=3', {}, opts);

          var tmp = window.getComputedStyle;
          window.getComputedStyle = function() {return {};};
          expect(ctrl.getNativeMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue - 3 : -1,
            top: opts.scrollingY ? scrollTopMaxValue - 3 : -1
          });
          window.getComputedStyle = tmp;
        });

        it('should use attr.distance as percent', function() {
          setupJS('distance=5%', {}, opts);
          expect(ctrl.getJSMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue * 0.95 : -1,
            top: opts.scrollingY ? scrollTopMaxValue * 0.95 : -1
          });

          setupNative('distance=5%', {}, opts);

          var tmp = window.getComputedStyle;
          window.getComputedStyle = function() {return {};};
          expect(ctrl.getNativeMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue * 0.95 : -1,
            top: opts.scrollingY ? scrollTopMaxValue * 0.95 : -1
          });
          window.getComputedStyle = tmp;
        });
      });

    });
  });

  describe('scroll event', function() {

    it('should do nothing if < left and top', function() {
      var el = setupJS('on-infinite="foo=1"');
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(false);
      expect(ctrl.isLoading).toBe(false);
      expect(el.scope().foo).not.toBe(1);

      var el = setupNative('on-infinite="foo=1"');
      var evObj = document.createEvent('HTMLEvents');
      evObj.initEvent('scroll', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null);
      ionic.requestAnimationFrame = function(cb) { cb(); };
      ctrl.scrollEl.dispatchEvent(evObj);

      expect(el.hasClass('active')).toBe(false);
      ionic.requestAnimationFrame = function() {};
      expect(ctrl.isLoading).toBe(false);
      expect(el.scope().foo).not.toBe(1);
    });
    it('should add active and call attr.onInfinite if >= top', function() {
      var el = setupJS('on-infinite="foo=1"');
      scrollTopValue = scrollTopMaxValue;
      ionic.requestAnimationFrame = function(cb) { cb(); };
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      ionic.requestAnimationFrame = function() {};
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);

      scrollTopValue = scrollTopMaxValue;
      var el = setupNative('on-infinite="foo=1"', {}, { scrollingX: true, scrollingY: true });
      ionic.requestAnimationFrame = function(cb) { cb(); };

      var tmp = window.getComputedStyle;
      window.getComputedStyle = function() {return {};};
      ctrl.checkBounds();
      window.getComputedStyle = tmp;
      expect(el.hasClass('active')).toBe(true);
      ionic.requestAnimationFrame = function() {};
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);
    });
    it('should add active and call attr.onInfinite if >= left', function() {
      var el = setupJS('on-infinite="foo=1"');
      scrollLeftValue = scrollLeftMaxValue;
      ionic.requestAnimationFrame = function(cb) { cb(); };
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      ionic.requestAnimationFrame = function() {};
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);

      scrollLeftValue = scrollLeftMaxValue;
      var el = setupNative('on-infinite="foo=1"', {}, { scrollingX: true, scrollingY: true });
      ionic.requestAnimationFrame = function(cb) { cb(); };

      var tmp = window.getComputedStyle;
      window.getComputedStyle = function() {return {};};
      ctrl.checkBounds();
      window.getComputedStyle = tmp;

      expect(el.hasClass('active')).toBe(true);
      ionic.requestAnimationFrame = function() {};
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);
    });
    it('should not run the event twice if isLoading is true', function() {
      var onScrollSpy = jasmine.createSpy('onInfiniteScroll');
      var el = setupJS('', { $onInfiniteScroll: onScrollSpy });
      scrollTopValue = scrollTopMaxValue;
      ionic.requestAnimationFrame = function(cb) { cb(); };
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      el.removeClass('active');
      expect(el.hasClass('active')).toBe(false);

      el.controller('$ionicScroll').$element.triggerHandler('scroll');
      expect(el.hasClass('active')).toBe(false);
      ionic.requestAnimationFrame = function() {};
    });

  });

  it('should checkbounds on launch', inject(function($timeout) {
    var el = setupJS();
    spyOn(el.controller('ionInfiniteScroll'),'checkBounds');
    expect(el.controller('ionInfiniteScroll').checkBounds).not.toHaveBeenCalled();
    $timeout.flush();
    expect(el.controller('ionInfiniteScroll').checkBounds).toHaveBeenCalled();
  }));

  it('should not checkbounds on launch if immediate-check=false', inject(function($timeout) {
    var el = setupJS('immediate-check="false"');
    spyOn(el.controller('ionInfiniteScroll'),'checkBounds');
    expect(el.controller('ionInfiniteScroll').checkBounds).not.toHaveBeenCalled();
    $timeout.flush();
    expect(el.controller('ionInfiniteScroll').checkBounds).not.toHaveBeenCalled();
  }));

  it('scroll.infiniteScrollComplete should work', inject(function($timeout) {
    var el = setupJS();
    ctrl.isLoading = true;
    el.addClass('active');
    ionic.requestAnimationFrame = function(cb) { cb(); };
    el.scope().$broadcast('scroll.infiniteScrollComplete');
    expect(ctrl.isLoading).toBe(false);
    expect(el.hasClass('active')).toBe(false);
    ionic.requestAnimationFrame = function() {};
    expect(el.controller('$ionicScroll').scrollView.resize).not.toHaveBeenCalled();
    $timeout.flush();
    expect(el.controller('$ionicScroll').scrollView.resize).toHaveBeenCalled();
  }));
});
