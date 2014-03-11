describe('ionicInfiniteScroll directive', function() {
  beforeEach(module('ionic'));

  var scrollTopValue;
  var scrollMaxValue;
  var ctrl;
  function setup(attrs, scopeProps) {
    var element;
    scrollTopValue = 50;
    scrollMaxValue = 101;
    inject(function($rootScope, $compile) {
      var scope = $rootScope.$new();
      angular.extend(scope, scopeProps || {});
      element = angular.element('<ion-infinite-scroll '+(attrs||'')+'></ion-infinite-scroll>');
      ionic.animationFrameThrottle = function(cb) { return function() { cb(); }; };
      element.data('$$ionicScrollController', {
        scrollView: {
          getValues: jasmine.createSpy('getValues').andCallFake(function() {
            return { top: scrollTopValue };
          }),
          getScrollMax: jasmine.createSpy('getScrollMax').andCallFake(function() {
            return { top: scrollMaxValue };
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
    it('getMaxScroll should default to 1%', function() {
      var el = setup();
      expect(ctrl.getMaxScroll()).toBe(101 * 0.99);
    });

    it('getMaxScroll should use attr.distance as number', function() {
      var el = setup('distance=3');
      expect(ctrl.getMaxScroll()).toBe(98);
    });

    it('getMaxScroll should use attr.distance as percent', function() {
      var el = setup('distance=5%');
      expect(ctrl.getMaxScroll()).toBe(101 * 0.95);
    });

    it('getMaxScroll should use scope.infiniteScrolDistance as number', function() {
      var el = setup('', { infiniteScrollDistance: '11' });
      expect(ctrl.getMaxScroll()).toBe(90);
    });

    it('getMaxScroll should use scope.infiniteScrolDistance as percent', function() {
      var el = setup('', { infiniteScrollDistance: '50%' });
      expect(ctrl.getMaxScroll()).toBe(101 * 0.5);
    });
  });

  describe('scroll event', function() {

    it('should add active and call attr.onInfinite if past top', function() {
      var el = setup('on-infinite="foo=1"');
      scrollTopValue = scrollMaxValue;
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      expect(ctrl.isLoading).toBe(true);
      expect(el.scope().foo).toBe(1);
    });
    it('should add active and call $scope.$onInfiniteScroll if past top', function() {
      var onScrollSpy = jasmine.createSpy('onInfiniteScroll');
      var el = setup('', { $onInfiniteScroll: onScrollSpy });
      scrollTopValue = scrollMaxValue;
      el.controller('$ionicScroll').$element.triggerHandler('scroll');

      expect(el.hasClass('active')).toBe(true);
      expect(ctrl.isLoading).toBe(true);
      expect(onScrollSpy).toHaveBeenCalled();
    });
    it('should not run the event twice if isLoading is true', function() {
      var onScrollSpy = jasmine.createSpy('onInfiniteScroll');
      var el = setup('', { $onInfiniteScroll: onScrollSpy });
      scrollTopValue = scrollMaxValue;
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
