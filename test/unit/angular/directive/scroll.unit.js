describe('Ionic Scroll Directive', function() {
  var compile, element, scope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
    ionic.Platform.setPlatform('Android');
    spyOn(ionic.Platform, 'ready').andCallFake(function(cb) {
      cb();
    });
  }));

  it('passes delegateHandle attribute', function() {
    var element = compile('<ion-scroll delegate-handle="handleThis">')(scope);
    expect(element.controller('$ionicScroll')._scrollViewOptions.delegateHandle)
      .toBe('handleThis');
  });

  it('passes hasBouncing attribute', function() {
    var el = compile('<ion-scroll has-bouncing="123">')(scope);
    expect(el.controller('$ionicScroll')._scrollViewOptions.bouncing).toEqual(123);
  });

  it('has $onScroll (used by $ionicScrollController)', function() {
    element = compile('<ion-scroll on-scroll="foo()"></ion-scroll>')(scope);
    scope = element.scope();
    scope.foo = jasmine.createSpy('foo');
    scope.$apply();
    expect(typeof scope.$onScroll).toBe('function');

    expect(scope.foo).not.toHaveBeenCalled();
    scope.$onScroll();
    expect(scope.foo).toHaveBeenCalled();
  });

  it('Has scroll-view class', function() {
    element = compile('<ion-scroll></ion-scroll>')(scope);
    expect(element.hasClass('scroll-view')).toBe(true);
  });

  it('should add padding classname', function() {
    element = compile('<ion-scroll padding="true"></ion-scroll>')(scope);
    scope.$apply();
    expect(element.children().eq(0).hasClass('padding')).toEqual(true);
    var scrollElement = element.find('.scroll');
    expect(scrollElement.hasClass('padding')).toEqual(true);
  });


  it('Should set start x and y', function() {
    element = compile('<ion-content overflow-scroll="false" start-x="100" start-y="300" has-header="true"></ion-content>')(scope);
    scope.$apply();
    var scrollView = element.controller('$ionicScroll').scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });
});
