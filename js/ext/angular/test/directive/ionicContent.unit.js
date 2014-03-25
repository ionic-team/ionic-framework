describe('Ionic Content directive', function() {
  var compile, scope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
    ionic.Platform.setPlatform('Android');
  }));

  it('Has $ionicScroll controller', function() {
    var element = compile('<ion-content></ion-content>')(scope);
    expect(element.controller('$ionicScroll').element).toBe(element[0]);
  });

  it('passes delegateHandle attribute', function() {
    var element = compile('<ion-content delegate-handle="handleMe">')(scope);
    expect(element.controller('$ionicScroll')._scrollViewOptions.delegateHandle)
      .toBe('handleMe');
  });

  it('Has content class', function() {
    var element = compile('<ion-content></ion-content>')(scope);
    expect(element.hasClass('scroll-content')).toBe(true);
  });

  it('has $onScroll (used by $ionicScrollController)', function() {
    element = compile('<ion-content on-scroll="foo()"></ion-content>')(scope);
    scope = element.scope();
    scope.foo = jasmine.createSpy('foo');
    scope.$apply();
    expect(typeof scope.$onScroll).toBe('function');

    expect(scope.foo).not.toHaveBeenCalled();
    scope.$onScroll();
    expect(scope.foo).toHaveBeenCalled();
  });

  ['header','subheader','footer','subfooter','tabs','tabs-top'].forEach(function(type) {
    var scopeVar = '$has' + type.split('-').map(function(part) {
      return part.charAt(0).toUpperCase() + part.substring(1);
    }).join('');
    var className = 'has-'+type;

    it('should has-' + type + ' when ' + scopeVar + ' == true', function() {
      var element = compile('<ion-content>')(scope.$new());
      scope = element.scope();

      expect(element.hasClass(className)).toBe(false);
      expect(scope[scopeVar]).toBeFalsy();

      scope.$apply(scopeVar + ' = true');
      expect(element.hasClass(className)).toBe(true);

      scope.$apply(scopeVar + ' = false');
      expect(element.hasClass(className)).toBe(false);
    });
  });

  it('should add padding classname', function() {
    var element = compile('<ion-content padding="shouldPad"></ion-content>')(scope);
    var scrollElement = element.find('.scroll');
    expect(scrollElement.hasClass('padding')).toEqual(false);
    element.scope().$apply('shouldPad = true');
    expect(scrollElement.hasClass('padding')).toEqual(true);
    element.scope().$apply('shouldPad = false');
    expect(scrollElement.hasClass('padding')).toEqual(false);
  });

  it('Should set start x and y', function() {
    var element = compile('<ion-content start-x="100" start-y="300"></ion-content>')(scope);
    scope.$apply();
    var scrollView = element.controller('$ionicScroll').scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });

});
/* Tests #555 */
describe('Ionic Content Directive scoping', function() {
  beforeEach(module('ionic', function($controllerProvider) {
    $controllerProvider.register('ContentTestCtrl', function($scope){
      this.$scope = $scope;
    });
  }));
  it('should have same scope as content', inject(function($compile, $rootScope) {
    var element = $compile('<ion-content ng-controller="ContentTestCtrl">' +
                           '<form name="myForm"></form>' +
                           '</ion-content>')($rootScope.$new());
    var contentScope = element.scope();
    var ctrl = element.data('$ngControllerController');
    expect(contentScope.myForm).toBeTruthy();
    expect(ctrl.$scope.myForm).toBeTruthy();
  }));
});
