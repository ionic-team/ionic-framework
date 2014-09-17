describe('$ionicConfigProvider', function() {

  it('should give default true', function() {
    module('ionic', function($ionicConfigProvider) {
      expect($ionicConfigProvider.prefetchTemplates()).toBe(true);
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.prefetchTemplates).toBe(true);
    });
  });

  it('should allow setting', function() {
    module('ionic', function($ionicConfigProvider) {
      $ionicConfigProvider.prefetchTemplates(false);
      expect($ionicConfigProvider.prefetchTemplates()).toBe(false);
    });
    inject(function($ionicConfig) {
      expect($ionicConfig.prefetchTemplates).toBe(false);
    });
  });

});
