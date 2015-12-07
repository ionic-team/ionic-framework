describe('Ionic Content directive', function() {
  var compile, scope, timeout, window, ionicConfig;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $window, $ionicConfig) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
    window = $window;
    ionicConfig = $ionicConfig;
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

    it('should has-' + type + ' when $parent.' + scopeVar + ' == true', function() {
      var element = compile('<ion-content>')(scope.$new());
      scope = element.scope();

      expect(element.hasClass(className)).toBe(false);
      expect(scope[scopeVar]).toBeFalsy();

      scope.$apply('$parent.' + scopeVar + ' = true');
      expect(element.hasClass(className)).toBe(true);

      scope.$apply('$parent.' + scopeVar + ' = false');
      expect(element.hasClass(className)).toBe(false);
    });

    it('should set $scope.' + scopeVar + ' to false on the ionContent element child scope, to stop inheritance of the has* classes', function() {
      var compileScope = scope.$new();
      compileScope[scopeVar] = true;
      var element = compile('<ion-content>')(compileScope);
      expect(compileScope[scopeVar]).toBe(true);
      expect(element.scope()[scopeVar]).toBe(false);
    });
  });

  it('should have no scroll element when scroll="false"', function() {
    var element = compile('<ion-content scroll="false"></ion-content>')(scope);
    var scroll = element.find('.scroll');

    expect(scroll.length).toBe(0);
  });

  it('should work scrollable with nested ionScroll elements', function() {
    var element = compile(
      '<ion-content scroll="false" class="content1">' +
        '<div>' +
          '<ion-content class="content2">' +
          '</ion-content>' +
        '</div>' +
      '</ion-content>')(scope);
    scope.$apply();

    expect(jqLite(element[0].querySelector('.content2')).controller('$ionicScroll')).toBeTruthy();
    expect(element.controller('$ionicScroll')).toBeFalsy();
  });

  it('should add padding classname to scroll element', function() {
    var element = compile('<ion-content padding="shouldPad"></ion-content>')(scope);
    var scroll = element.find('.scroll');

    // by default, ion-content should have a scroll element, and the scroll element should not be padded
    expect(scroll.hasClass('padding')).toEqual(false);
    expect(element.hasClass('padding')).toEqual(false);

    element.scope().$apply('shouldPad = true');
    expect(scroll.hasClass('padding')).toEqual(true);
    expect(element.hasClass('padding')).toEqual(false);

    element.scope().$apply('shouldPad = false');
    expect(scroll.hasClass('padding')).toEqual(false);
    expect(element.hasClass('padding')).toEqual(false);

  });

  // keep scroll=false && padding tests separate as we don't handle a recompile yet when scroll changes.
  it('should add padding classname to scroll-content element', function() {
    var element = compile('<ion-content padding="shouldPad" scroll="false"></ion-content>')(scope);

    // when ion-content is not scrollable, there will be no scroll element, the padding should be added to ion-content itself.
    element.scope().$apply('shouldPad = false');
    expect(element.hasClass('padding')).toEqual(false);

    element.scope().$apply('shouldPad = true');
    expect(element.hasClass('padding')).toEqual(true);
  });

  it('Should set start x and y', inject(function($ionicConfig) {
    $ionicConfig.scrolling.jsScrolling(true);
    var element = compile('<ion-content start-x="100" start-y="300"></ion-content>')(scope);
    scope.$apply();
    var scrollView = element.controller('$ionicScroll').scrollView;
    var vals = scrollView.getValues();
    expect(vals.left).toBe(100);
    expect(vals.top).toBe(300);
  }));

  it('Should allow native scrolling to be set by $ionicConfig ', function() {
    ionicConfig.scrolling.jsScrolling(false);
    var element = compile('<ion-content></ion-content>')(scope);
    expect(element.hasClass('overflow-scroll')).toBe(true);
  });

  it('should call on-scrolling-complete attribute callback with locals', function() {
    scope.youCompleteMe = jasmine.createSpy('scrollComplete');
    var element = compile('<ion-content overflow-scroll="false" on-scroll-complete="youCompleteMe(scrollLeft, scrollTop)">')(scope);
    scope.$apply();
    element.controller('$ionicScroll').scrollView.__scrollingComplete();
    expect(scope.youCompleteMe).toHaveBeenCalledWith(0, 0);
  });

});
/* Tests #555, #1155 */
describe('Ionic Content Directive scoping', function() {
  beforeEach(module('ionic', function($controllerProvider) {
    $controllerProvider.register('ContentTestCtrl', function($scope){
      this.$scope = $scope;
    });
  }));
  it('should have same scope as content', inject(function($compile, $rootScope) {
    var element = $compile('<ion-content ng-controller="ContentTestCtrl">' +
                           '<form name="myForm"></form>' +
                           '<input ng-model="foo">' +
                           '</ion-content>')($rootScope.$new());
    var contentScope = element.scope();
    var ctrl = element.data('$ngControllerController');
    expect(contentScope.myForm).toBeTruthy();
    expect(ctrl.$scope.myForm).toBeTruthy();
    var input = angular.element(element[0].querySelector('input'));
    input.val('bar');
    input.triggerHandler('input');
    expect(input.scope().foo).toBe('bar');
    expect(ctrl.$scope.foo).toBe('bar');
  }));


});
