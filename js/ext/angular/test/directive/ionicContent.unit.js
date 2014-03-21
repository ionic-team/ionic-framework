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
    var scrollView = scope.$ionicScrollController.scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  });

  it('should pass attr.controllerBind ionicScrollController', function() {
    var element = compile('<ion-content controller-bind="scrolly">')(scope);
    scope.$apply();
    expect(scope.scrolly).toBe(element.controller('$ionicScroll'));
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
