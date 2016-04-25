describe('$ionicLoading service', function() {
  beforeEach(module('ionic', function($provide) {
    //Set default options to blank for the sake of tests
    $provide.constant('$ionicLoadingConfig', {});
  }));
  it('should reuse loader instance for getLoader', inject(function($ionicLoading) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    var loader2 = TestUtil.unwrapPromise($ionicLoading._getLoader());
    expect(loader).toBe(loader2);
  }));

  describe('.show()', function() {

    it('should retain backdrop if !noBackdrop and !isShown', inject(function($ionicLoading, $ionicBackdrop) {
      spyOn($ionicBackdrop, 'retain');
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({});
      expect($ionicBackdrop.retain).toHaveBeenCalled();
    }));
    it('should not retain backdrop if noBackdrop', inject(function($ionicLoading, $ionicBackdrop) {
      spyOn($ionicBackdrop, 'retain');
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({ noBackdrop: true });
      expect($ionicBackdrop.retain).not.toHaveBeenCalled();
    }));
    it('should not retain backdrop if isShown', inject(function($ionicLoading, $ionicBackdrop) {
      spyOn($ionicBackdrop, 'retain');
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.isShown = true;
      loader.show({});
      expect($ionicBackdrop.retain).not.toHaveBeenCalled();
    }));

    it('should not timeout if no duration', inject(function($ionicLoading, $timeout) {
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({});
      expect(loader.durationTimeout).toBeFalsy();
    }));
    it('should timeout if duration', inject(function($ionicLoading, $timeout) {
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({ duration: 1000 });
      expect(loader.durationTimeout).toBeTruthy();
      expect(loader.durationTimeout.$$timeoutId).toBeTruthy();
    }));
    it('should add active', inject(function($ionicLoading, $timeout) {
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      ionic.requestAnimationFrame = function(cb) { cb(); };
      expect(loader.element.hasClass('active')).toBe(false);
      loader.show({});
      $timeout.flush();
      expect(loader.element.hasClass('active')).toBe(true);
    }));
    it('should isShown = true', inject(function($ionicLoading) {
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      expect(loader.isShown).toBeFalsy();
      loader.show({});
      expect(loader.isShown).toBe(true);
    }));

    it('should use options.template', inject(function($ionicLoading, $rootScope) {
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({ template: 'foo {{"bar"}}' });
      $rootScope.$apply();
      expect(loader.element.text()).toBe('foo bar');
    }));

    it('should use options.templateUrl', inject(function($ionicLoading, $rootScope, $ionicTemplateLoader, $q) {
      spyOn($ionicTemplateLoader, 'load').andReturn($q.when('{{1}} content'));
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({ templateUrl: 'template.html' });
      expect($ionicTemplateLoader.load).toHaveBeenCalledWith('template.html');
      $rootScope.$apply();
      expect(loader.element.text()).toBe('1 content');
    }));

    it('should add and remove backdrop-loading to backdrop', inject(function($ionicLoading, $ionicBackdrop) {
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.show({ templateUrl: 'template.html' });
      expect($ionicBackdrop._element.hasClass('backdrop-loading')).toBe(true);
      loader.hide();
      expect($ionicBackdrop._element.hasClass('backdrop-loading')).toBe(false);
    }));

    it('should add and remove loading-active class to body', inject(function($ionicLoading, $timeout) {
      // used by _modal.scss to prevent clicks on modal screen when loading is active
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      ionic.requestAnimationFrame = function(cb) { cb(); };
      loader.show({});
      $timeout.flush();
      expect(angular.element(document.body).hasClass('loading-active')).toBe(true);
      loader.hide();
      expect(angular.element(document.body).hasClass('loading-active')).toBe(false);
    }));

  });

  describe('.hide()', function() {

    it('should release backdrop if hasBackdrop and isShown', inject(function($ionicLoading, $ionicBackdrop) {
      spyOn($ionicBackdrop, 'release');
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.isShown = true;
      loader.hasBackdrop = true;
      loader.hide();
      expect($ionicBackdrop.release).toHaveBeenCalled();
    }));
    it('should not release backdrop if !hasBackdrop', inject(function($ionicLoading, $ionicBackdrop) {
      spyOn($ionicBackdrop, 'release');
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.isShown = true;
      loader.hide();
      expect($ionicBackdrop.release).not.toHaveBeenCalled();
    }));
    it('should cancel durationTimeout and set isShown to false', inject(function($ionicLoading, $timeout) {
      spyOn($timeout, 'cancel');
      var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
      loader.durationTimeout = {};
      loader.isShown = true;
      loader.hide({});
      expect($timeout.cancel).toHaveBeenCalledWith(loader.durationTimeout);
      expect(loader.isShown).toBe(false);
    }));

  });

  it('should show with options', inject(function($ionicLoading, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    spyOn(loader, 'show');
    var options = {};
    $ionicLoading.show(options);
    $timeout.flush();
    expect(loader.show).toHaveBeenCalledWith(options);
  }));

  it('should $timeout.cancel & hide', inject(function($ionicLoading, $rootScope, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    spyOn($timeout, 'cancel');
    spyOn(loader, 'hide');
    $ionicLoading.hide();
    expect($timeout.cancel).toHaveBeenCalled();
    $rootScope.$apply();
    expect(loader.hide).toHaveBeenCalled();
  }));

  it('hide should cancel show delay and just go ahead and hide', inject(function($ionicLoading, $timeout) {
    ionic.requestAnimationFrame = function(cb) { cb(); };
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    spyOn(loader, 'hide').andCallThrough();
    spyOn(loader, 'show').andCallThrough();
    $ionicLoading.show({ delay: 1000 });
    $ionicLoading.hide();
    expect(loader.show).not.toHaveBeenCalled();
    expect(loader.hide).not.toHaveBeenCalled();
    $timeout.flush();
    expect(loader.show).not.toHaveBeenCalled();
    expect(loader.hide).toHaveBeenCalled();
    expect(loader.isShown).toBe(false);
    expect(loader.element.hasClass('active')).toBe(false);
  }));

  describe("back button", function() {
    it('.show() should register back button action', inject(function($ionicLoading, $ionicPlatform, $timeout, IONIC_BACK_PRIORITY) {
      spyOn($ionicPlatform, 'registerBackButtonAction');
      $ionicLoading.show();
      $timeout.flush();
      expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalledWith(
        angular.noop,
        IONIC_BACK_PRIORITY.loading
      );
    }));
    it('.hide() should deregister back button action', inject(function($ionicLoading, $ionicPlatform, $timeout) {
      var deregisterSpy = jasmine.createSpy('deregister');
      spyOn($ionicPlatform, 'registerBackButtonAction').andReturn(deregisterSpy);
      $ionicLoading.show();
      $timeout.flush();
      expect(deregisterSpy).not.toHaveBeenCalled();
      $ionicLoading.hide();
      $timeout.flush();
      expect(deregisterSpy).toHaveBeenCalled();
    }));
  });

  it('should use options.hideOnStateChange to hide on $stateChangeSuccess', inject(function($ionicLoading, $rootScope, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    $ionicLoading.show({
      hideOnStateChange: true,
      template: ''
    });
    spyOn(loader, 'hide');
    $rootScope.$broadcast('$stateChangeSuccess');
    $rootScope.$apply();
    expect(loader.hide).toHaveBeenCalled();
  }));

  it('should use options.hideOnStateChange to hide on $stateChangeError', inject(function($ionicLoading, $rootScope, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    $ionicLoading.show({
      hideOnStateChange: true,
      template: ''
    });
    spyOn(loader, 'hide');
    $rootScope.$broadcast('$stateChangeError');
    $rootScope.$apply();
    expect(loader.hide).toHaveBeenCalled();
  }));

  it('should default false options.hideOnStateChange', inject(function($ionicLoading, $rootScope, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    $ionicLoading.show({
      template: ''
    });
    spyOn(loader, 'hide');
    $rootScope.$broadcast('$stateChangeSuccess');
    $rootScope.$apply();
    expect(loader.hide).not.toHaveBeenCalled();
  }));

});
describe('$ionicLoadingConfig', function() {
  beforeEach(module('ionic', function($provide) {
    $provide.constant('$ionicLoadingConfig', {
      template: 'some template'
    });
  }));

  it('should use $ionicLoadingConfig options by default', inject(function($ionicLoading, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    $ionicLoading.show();
    $timeout.flush();
    expect(loader.element.text()).toBe('some template');
  }));

  it('should allow override', inject(function($ionicLoading, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    $ionicLoading.show({
      template: 'some other template'
    });
    $timeout.flush();
    expect(loader.element.text()).toBe('some other template');
  }));

  it('should use the original defaults with subsequent calls', inject(function($ionicLoading, $timeout) {
    var loader = TestUtil.unwrapPromise($ionicLoading._getLoader());
    $ionicLoading.show({
      template: 'some other template'
    });
    $timeout.flush();
    expect(loader.element.text()).toBe('some other template');
    $ionicLoading.hide();
    $timeout.flush();
    $ionicLoading.show();
    $timeout.flush();
    expect(loader.element.text()).toBe('some template');
  }));

});
