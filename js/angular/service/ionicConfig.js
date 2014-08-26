/**
 * @ngdoc provider
 * @name $ionicConfigProvider
 * @module ionic
 * @description $ionicConfigProvider can be used during the configuration phase of your app
 * to change how Ionic works.
 *
 * @usage
 * ```js
 * var myApp = angular.module('reallyCoolApp', ['ionic']);
 *
 * myApp.config(function($ionicConfigProvider) {
 *   $ionicConfigProvider.prefetchTemplates(false);
 * });
 * ```
 */
IonicModule
.provider('$ionicConfig', function() {

  var provider = this;
  var config = {
    prefetchTemplates: true
  };

  /**
   * @ngdoc method
   * @name $ionicConfigProvider#prefetchTemplates
   * @description Set whether Ionic should prefetch all templateUrls defined in
   * $stateProvider.state. Default true. If set to false, the user will have to wait
   * for a template to be fetched the first time he/she is going to a a new page.
   * @param shouldPrefetch Whether Ionic should prefetch templateUrls defined in
   * `$stateProvider.state()`. Default true.
   * @returns {boolean} Whether Ionic will prefetch templateUrls defined in $stateProvider.state.
   */
  this.prefetchTemplates = function(newValue) {
    if (arguments.length) {
      config.prefetchTemplates = newValue;
    }
    return config.prefetchTemplates;
  };

  // private: Service definition for internal Ionic use
  /**
   * @ngdoc service
   * @name $ionicConfig
   * @module ionic
   * @private
   */
  this.$get = function() {
    return config;
  };
});
