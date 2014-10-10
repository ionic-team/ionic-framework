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

  // container of all ionic configs
  // The angular world should use $ionicConfig
  var config = ionic.config = {};


  /**
   * @ngdoc method
   * @name $ionicConfigProvider#prefetchTemplates
   * @description Set whether Ionic should prefetch all templateUrls defined in
   * $stateProvider.state. If set to false, the user will have to wait
   * for a template to be fetched the first time when navigating to a new page. Default `true`.
   * @param {boolean} shouldPrefetch Whether Ionic should prefetch templateUrls defined in
   * `$stateProvider.state()`.
   * @returns {boolean} Whether Ionic will prefetch templateUrls defined in $stateProvider.state.
   */
  config.prefetchTemplates = true;



  // private: create methods for each config to get/set
  var provider = this;
  forEach(config, function(defaultValue, configMethod) {
    provider[configMethod] = function(newValue) {
      if (arguments.length) {
        config[configMethod] = newValue;
      }
      return config[configMethod];
    };
  });

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
