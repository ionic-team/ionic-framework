// closure to keep things neat
(function() {
  var templatesToCache = [];

/**
 * @ngdoc service
 * @name $ionicTemplateCache
 * @module ionic
 * @description A service that preemptively caches template files to eliminate transition flicker and boost performance.
 * @usage
 * State templates are cached automatically, but you can optionally cache other templates.
 *
 * ```js
 * $ionicTemplateCache('myNgIncludeTemplate.html');
 * ```
 *
 * Optionally disable all preemptive caching with the `$ionicConfigProvider` or individual states by setting `prefetchTemplate`
 * in the `$state` definition
 *
 * ```js
 *   angular.module('myApp', ['ionic'])
 *   .config(function($stateProvider, $ionicConfigProvider) {
 *
 *     // disable preemptive template caching globally
 *     $ionicConfigProvider.prefetchTemplates(false);
 *
 *     // disable individual states
 *     $stateProvider
 *       .state('tabs', {
 *         url: "/tab",
 *         abstract: true,
 *         prefetchTemplate: false,
 *         templateUrl: "tabs-templates/tabs.html"
 *       })
 *       .state('tabs.home', {
 *         url: "/home",
 *         views: {
 *           'home-tab': {
 *             prefetchTemplate: false,
 *             templateUrl: "tabs-templates/home.html",
 *             controller: 'HomeTabCtrl'
 *           }
 *         }
 *       });
 *   });
 * ```
 */
IonicModule
.factory('$ionicTemplateCache', [
'$http',
'$templateCache',
'$timeout',
'$ionicConfig',
function($http, $templateCache, $timeout, $ionicConfig) {
  var toCache = templatesToCache,
      hasRun = false;

  function $ionicTemplateCache(templates){
    if(toCache.length > 500) return false;
    if(typeof templates === 'undefined')return run();
    if(isString(templates))templates = [templates];
    forEach(templates, function(template){
      toCache.push(template);
    });
    // is this is being called after the initial IonicModule.run()
    if(hasRun) run();
  }

  // run through methods - internal method
  var run = function(){
    if($ionicConfig.prefetchTemplates === false)return;
    //console.log('prefetching', toCache);
    //for testing
    $ionicTemplateCache._runCount++;

    hasRun = true;
    // ignore if race condition already zeroed out array
    if(toCache.length === 0)return;
    //console.log(toCache);
    var i = 0;
    while ( i < 5 && (template = toCache.pop()) ) {
      // note that inline templates are ignored by this request
      if (isString(template)) $http.get(template, { cache: $templateCache });
      i++;
    }
    // only preload 5 templates a second
    if(toCache.length)$timeout(function(){run();}, 1000);
  };

  // exposing for testing
  $ionicTemplateCache._runCount = 0;
  // default method
  return $ionicTemplateCache;
}])

// Intercepts the $stateprovider.state() command to look for templateUrls that can be cached
.config([
'$stateProvider',
'$ionicConfigProvider',
function($stateProvider, $ionicConfigProvider) {
  var stateProviderState = $stateProvider.state;
  $stateProvider.state = function(stateName, definition) {
    // don't even bother if it's disabled. note, another config may run after this, so it's not a catch-all
    if($ionicConfigProvider.prefetchTemplates() !== false){
      var enabled = definition.prefetchTemplate !== false;
      if(enabled && isString(definition.templateUrl))templatesToCache.push(definition.templateUrl);
      if(angular.isObject(definition.views)){
        for (var key in definition.views){
          enabled = definition.views[key].prefetchTemplate !== false;
          if(enabled && isString(definition.views[key].templateUrl)) templatesToCache.push(definition.views[key].templateUrl);
        }
      }
    }
    return stateProviderState.call($stateProvider, stateName, definition);
  };
}])

// process the templateUrls collected by the $stateProvider, adding them to the cache
.run(function($ionicTemplateCache) {
    $ionicTemplateCache();
});

})();
