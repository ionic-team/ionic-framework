describe('ionicInfiniteScroll directive', function() {
  beforeEach(module('ionic'));

  var scrollTopValue;
  var scrollTopMaxValue;
  var scrollLeftValue;
  var scrollLeftMaxValue;
  var ctrl;
  function setup(attrs, scopeProps, options) {
    var element;
    scrollTopValue = 50;
    scrollLeftValue = 60;
    scrollLeftMaxValue = 101;
    scrollTopMaxValue = 121;
    inject(function($rootScope, $compile) {
      var scope = $rootScope.$new();
      angular.extend(scope, scopeProps || {});
      element = angular.element('<ion-infinite-scroll '+(attrs||'')+'></ion-infinite-scroll>');
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
        $element: angular.element('<div>')
      });
      $compile(element)(scope);
      ctrl = element.controller('ionInfiniteScroll');
      scope.$apply();
    });
    return element;
  }

  it('should error if no ionicScroll parent', function() {
    expect(function() {
      inject(function($compile, $rootScope) {
        $compile('<ion-infinite-scroll></ion-infinite-scroll>')($rootScope.$new());
      });
    }).toThrow();
  });

  it('should not have class or be loading by default', function() {
    var el = setup();
    expect(el.hasClass('active')).toBe(false);
    expect(ctrl.isLoading).toBe(false);
  });

  it('should unbind scroll event on destroy', function() {
    var el = setup();
    spyOn(el.controller('$ionicScroll').$element, 'off');
    el.scope().$destroy();
    expect(el.controller('$ionicScroll').$element.off).toHaveBeenCalledWith('scroll', jasmine.any(Function));

  });

  describe('icon', function() {
    it('should have default icon ion-loading-d', function() {
      var el = setup();
      var icon = angular.element(el[0].querySelector('.icon'));
      expect(icon.hasClass('ion-loading-d')).toBe(true);
    });

    it('should allow icon attr blank', function() {
      var el = setup('icon=""');
      var icon = angular.element(el[0].querySelector('.icon'));
      expect(icon.hasClass('ion-loading-d')).toBe(false);
    });

    it('should allow interpolated icon attr', function() {
      var el = setup('icon="{{someIcon}}"');
      var icon = angular.element(el[0].querySelector('.icon'));
      expect(icon.hasClass('ion-loading-d')).toBe(false);
      el.scope().$apply('someIcon = "super-icon"');
      expect(icon.hasClass('super-icon')).toBe(true);
    });
  });

  describe('getMaxScroll', function() {
    [ { scrollingX: true,  scrollingY: true, },
      { scrollingX: false, scrollingY: true },
      { scrollingX: true,  scrollingY: false }
    ].forEach(function(opts) {

      describe('with scrollingX='+opts.scrollingX+', scrollingY='+opts.scrollingY, function() {
        it('should default to 2.5%', function() {
          var el = setup('', {}, opts);
          expect(ctrl.getMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue * 0.975 : -1,
            top: opts.scrollingY ? scrollTopMaxValue * 0.975 : -1
          });
        });

        it('should use attr.distance as number', function() {
          var el = setup('distance=3', {}, opts);
          expect(ctrl.getMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue - 3 : -1,
            top: opts.scrollingY ? scrollTopMaxValue - 3 : -1
          });
        });

        it('should use attr.distance as percent', function() {
          var el = setup('distance=5%', {}, opts);
          expect(ctrl.getMaxScroll()).toEqual({
            left: opts.scrollingX ? scrollLeftMaxValue * 0.95 : -1,
            top: opts.scrollingY ? scrollTopMaxValue * 0.95 : -1
          });
        });
      });

    });
  });

  describe('scroll event', function() {

    it('should do nothing if < left and top', function() {
      var el = setup('on-infinite="foo=1"');
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(false);
      expect(ctrl.isLoading).toBe(false);
      expect(el.scope().foo).not.toBe(1);
    });
    it('should add active and call attr.onInfinite if >= top', function() {
      var el = setup('on-infinite="foo=1"');
      scrollTopValue = scrollTopMaxValue;
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);
    });
    it('should add active and call attr.onInfinite if >= left', function() {
      var el = setup('on-infinite="foo=1"');
      scrollLeftValue = scrollLeftMaxValue;
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);
    });
    it('should not run the event twice if isLoading is true', function() {
      var onScrollSpy = jasmine.createSpy('onInfiniteScroll');
      var el = setup('', { $onInfiniteScroll: onScrollSpy });
      scrollTopValue = scrollTopMaxValue;
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      el.removeClass('active');
      expect(el.hasClass('active')).toBe(false);

      el.controller('$ionicScroll').$element.triggerHandler('scroll');
      expect(el.hasClass('active')).toBe(false);
    });

  });

  it('scroll.infiniteScrollComplete should work', inject(function($timeout) {
    var el = setup();
    ctrl.isLoading = true;
    el.addClass('active');
    el.scope().$broadcast('scroll.infiniteScrollComplete');
    expect(ctrl.isLoading).toBe(false);
    expect(el.hasClass('active')).toBe(false);
    expect(el.controller('$ionicScroll').scrollView.resize).not.toHaveBeenCalled();
    $timeout.flush();
    expect(el.controller('$ionicScroll').scrollView.resize).toHaveBeenCalled();
  }));

});
