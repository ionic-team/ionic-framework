describe('Ionic Content directive', function() {
  var compile, element, scope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
    ionic.Platform.setPlatform('Android');
  }));

  it('Has $ionicScroll controller', function() {
    element = compile('<ion-content></ion-content>')(scope);
    expect(element.controller('$ionicScroll').element).toBe(element[0]);
  });

  it('Has content class', function() {
    element = compile('<ion-content></ion-content>')(scope);
    expect(element.hasClass('scroll-content')).toBe(true);
  });

  it('Has header', function() {
    element = compile('<ion-content has-header="true"></ion-content>')(scope);
    expect(element.hasClass('has-header')).toEqual(true);
  });

  it('should add padding classname', function() {
    element = compile('<ion-content padding="true"></ion-content>')(scope);
    expect(element.hasClass('scroll-content')).toEqual(true);
    expect(element.hasClass('padding')).toEqual(false);
    var scrollElement = element.find('.scroll');
    expect(scrollElement.hasClass('padding')).toEqual(true);
  });

  it('Enables bouncing by default', function() {
    ionic.Platform.setPlatform('iPhone');
    element = compile('<ion-content has-header="true"></ion-content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
  });

  it('Disables bouncing when has-bouncing = false', function() {
    ionic.Platform.setPlatform('iPhone');
    element = compile('<ion-content has-header="true" has-bouncing="false"></ion-content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android', function() {
    ionic.Platform.setPlatform('Android');
    element = compile('<ion-content has-header="true"></ion-content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(false);
  });

  it('Disables bouncing by default on Android unless has-bouncing = true', function() {
    ionic.Platform.setPlatform('Android');
    element = compile('<ion-content has-header="true" has-bouncing="true"></ion-content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    expect(scrollView.options.bouncing).toBe(true);
  });


  it('Should set start x and y', function() {
    element = compile('<ion-content start-x="100" start-y="300" has-header="true"></ion-content>')(scope);
    scope.$apply();
    var newScope = element.isolateScope();
    var scrollView = scope.scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });

  describe('save scroll', function() {

    function compileWithParent() {
      var parent = angular.element('<div>');
      //Make a phony element that tells the world it's a navView when in reality it's just a div
      parent.data('$navViewController', true);
      parent.append('<ion-content><br/><div>hello</div><br/></ion-content>');
      compile(parent)(scope);
      scope.$apply();

      /* Mock setting and getting scroll because we don't have time for the dom to load */
      var scrollValues = {};
      spyOn(scope.scrollView, 'scrollTo').andCallFake(function(left, top, a, zoom) {
        scrollValues = {
          left: left || 0,
          top: top || 0,
          zoom: zoom || 1
        };
      });
      spyOn(scope.scrollView, 'getValues').andCallFake(function() {
        return scrollValues;
      });
    }

    it('should set x and y with historyData.scrollValues passed in through $viewContentLoaded', function() {
      compileWithParent();
      var scrollValues = { top: 40, left: -20, zoom: 3 };
      scope.$broadcast('$viewContentLoaded', {
        scrollValues: scrollValues
      });
      timeout.flush();
      expect(scope.scrollView.scrollTo.mostRecentCall.args).toEqual([-20, 40]);
    });

    it('should set null with historyData.scrollValues not valid', function() {
      compileWithParent();
      var scrollValues = { left: 'bar', top: 'foo' };
      scope.$broadcast('$viewContentLoaded', { scrollValues: scrollValues });
      timeout.flush();
      expect(scope.scrollView.scrollTo.mostRecentCall.args).toEqual([null, null]);
    });

    it('should save scroll on the historyData passed in on $destroy', function() {
      compileWithParent();
      var historyData = {};
      scope.$broadcast('$viewContentLoaded', historyData);
      timeout.flush();
      scope.scrollView.scrollTo(null, 9, false);
      expect(historyData.scrollValues).toBeUndefined(); //sanity test
      scope.$destroy();
      expect(historyData.scrollValues).toEqual({
        left: 0,
        top: 9,
        zoom: 1
      });
    });
  });
});
