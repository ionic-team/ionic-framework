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

  it('Has $ionicScroll controller', function() {
    element = compile('<ion-scroll></ion-scroll>')(scope);
    expect(element.controller('$ionicScroll').element).toBe(element[0]);
  });

  it('Has scroll-view class', function() {
    element = compile('<ion-scroll></ion-scroll>')(scope);
    expect(element.hasClass('scroll-view')).toBe(true);
  });

  it('should add padding classname', function() {
    element = compile('<ion-scroll padding="true"></ion-scroll>')(scope);
    expect(element.children().eq(0).hasClass('padding')).toEqual(true);
    var scrollElement = element.find('.scroll');
    expect(scrollElement.hasClass('padding')).toEqual(true);
  });

  it('Enables bouncing by default', function() {
    ionic.Platform.setPlatform('iPhone');
    element = compile('<ion-content has-header="true"></ion-scroll>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
  });

  it('Disables bouncing when has-bouncing = false', function() {
    ionic.Platform.setPlatform('iPhone');
    element = compile('<ion-content has-header="true" has-bouncing="false"></ion-scroll>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android', function() {
    ionic.Platform.setPlatform('Android');
    element = compile('<ion-content has-header="true"></ion-scroll>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Should set start x and y', function() {
    element = compile('<ion-content start-x="100" start-y="300" has-header="true"></ion-scroll>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });
});
