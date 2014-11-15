describe('$ionicConfigProvider', function() {

  it('should allow setting', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.templates.maxPrefetch(0);
      expect($ionicConfigProvider.templates.maxPrefetch()).toBe(0);
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.templates.maxPrefetch()).toBe(0);
    });
  });

  it('should get/set exact value for all platforms', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.views.transition('my-transition');
      expect($ionicConfigProvider.views.transition()).toBe('my-transition');
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.views.transition()).toBe('my-transition');
    });
  });

  it('should get default value for unknown platform', function() {
    module('ionic', function($ionicConfigProvider) {});
    inject(function($ionicConfig) {
      ionic.Platform.setPlatform('whatever');
      expect($ionicConfig.views.transition()).toBe('ios');
    });
  });

  it('should get default value for ios platform', function() {
    module('ionic', function($ionicConfigProvider) {});
    inject(function($ionicConfig) {
      ionic.Platform.setPlatform('ios');
      expect($ionicConfig.views.transition()).toBe('ios');
    });
  });

  it('should get default value for android platform', function() {
    module('ionic', function($ionicConfigProvider) {});
    inject(function($ionicConfig) {
      ionic.Platform.setPlatform('android');
      expect($ionicConfig.views.transition()).toBe('android');
    });
  });

  it('should set default platform value for android platform', function() {
    module('ionic', function($ionicConfigProvider) {});
    inject(function($ionicConfig) {
      ionic.Platform.setPlatform('android');
      expect($ionicConfig.views.transition()).toBe('android');

      $ionicConfig.platform.android.views.transition('android-whatnot');

      ionic.Platform.setPlatform('ios');
      expect($ionicConfig.views.transition()).toBe('ios');

      ionic.Platform.setPlatform('android');
      expect($ionicConfig.views.transition()).toBe('android-whatnot');
    });
  });

  it('should set default platform value for ios platform', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.platform.android.views.transition('custom-transition');
    });
    inject(function($ionicConfig) {
      ionic.Platform.setPlatform('ios');
      expect($ionicConfig.views.transition()).toBe('ios');

      $ionicConfig.platform.ios.views.transition('ios-whatnot');

      ionic.Platform.setPlatform('android');
      expect($ionicConfig.views.transition()).toBe('custom-transition');

      ionic.Platform.setPlatform('ios');
      expect($ionicConfig.views.transition()).toBe('ios-whatnot');
    });
  });

  it('should set a new platform', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.setPlatformConfig('win32', {
        views: {
          transition: 'win32-transition'
        },
        navBar: {
          alignTitle: 'right',
          positionPrimaryButtons: 'left',
          positionSecondaryButtons: 'left'
        },
        backButton: {
          icon: 'ion-win32-arrow-back'
        }
      });
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.views.transition()).toBe('ios');
      expect($ionicConfig.navBar.alignTitle()).toBe('center');

      ionic.Platform.setPlatform('win32');
      expect($ionicConfig.views.transition()).toBe('win32-transition');
      expect($ionicConfig.navBar.alignTitle()).toBe('right');
      expect($ionicConfig.navBar.positionPrimaryButtons()).toBe('left');
      expect($ionicConfig.navBar.positionSecondaryButtons()).toBe('left');
      expect($ionicConfig.backButton.icon()).toBe('ion-win32-arrow-back');

      $ionicConfig.platform.win32.views.transition('winwin-transition');
      expect($ionicConfig.views.transition()).toBe('winwin-transition');
    });
  });

  it('should set a new default in the default platform', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.platform.default.views.transition('new-default');
      $ionicConfigProvider.platform.ios.views.transition('new-ios');
      $ionicConfigProvider.platform.android.views.transition('new-android');
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.views.transition()).toBe('new-default');

      ionic.Platform.setPlatform('ios');
      expect($ionicConfig.views.transition()).toBe('new-ios');

      ionic.Platform.setPlatform('android');
      expect($ionicConfig.views.transition()).toBe('new-android');
    });
  });

  it('should set defaults by chaining', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.navBar.alignTitle('right')
                                 .positionPrimaryButtons('right')
                                 .positionSecondaryButtons('left');
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.navBar.alignTitle()).toBe('right');
      expect($ionicConfig.navBar.positionPrimaryButtons()).toBe('right');
      expect($ionicConfig.navBar.positionSecondaryButtons()).toBe('left');
    });
  });

});
