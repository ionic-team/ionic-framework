describe('$ionicSideMenus controller', function() {
  beforeEach(module('ionic'));

  function setup(locals, props) {
    var ctrl;
    inject(function($controller, $rootScope) {
      var scope = $rootScope.$new();
      ctrl = $controller('$ionicSideMenus', angular.extend({
        $scope: scope,
        $attrs: {}
      }, locals || {}));
      angular.extend(ctrl, props || {});
    });
    return ctrl;
  }

  it('should register with backButton on open and dereg on close', inject(function($ionicPlatform) {
    var openAmount = 0;
    var deregSpy = jasmine.createSpy('deregister');
    spyOn($ionicPlatform, 'registerBackButtonAction').andReturn(deregSpy);

    var ctrl = setup();
    spyOn(ctrl, 'getOpenAmount').andCallFake(function() { return openAmount; });

    expect($ionicPlatform.registerBackButtonAction).not.toHaveBeenCalled();
    openAmount = 1;
    ctrl.$scope.$apply();
    expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalledWith(
      jasmine.any(Function),
      PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU
    );
    expect(deregSpy).not.toHaveBeenCalled();
    openAmount = 0;
    ctrl.$scope.$apply();
    expect(deregSpy).toHaveBeenCalled();
  }));

  it('should deregister back button action on $destroy', inject(function($ionicPlatform) {
    var openAmount = 0;
    var deregSpy = jasmine.createSpy('deregister');
    spyOn($ionicPlatform, 'registerBackButtonAction').andReturn(deregSpy);

    var ctrl = setup();
    spyOn(ctrl, 'getOpenAmount').andCallFake(function() { return openAmount; });

    expect($ionicPlatform.registerBackButtonAction).not.toHaveBeenCalled();
    openAmount = 1;
    ctrl.$scope.$apply();
    expect(deregSpy).not.toHaveBeenCalled();
    ctrl.$scope.$destroy();
    expect(deregSpy).toHaveBeenCalled();
  }));
});
