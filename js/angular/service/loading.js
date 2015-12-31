
var LOADING_TPL =
  '<div class="loading-container">' +
    '<div class="loading">' +
    '</div>' +
  '</div>';

var LOADING_HIDE_DEPRECATED = '$ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().';
var LOADING_SHOW_DEPRECATED = '$ionicLoading instance.show() has been deprecated. Use $ionicLoading.show().';
var LOADING_SET_DEPRECATED = '$ionicLoading instance.setContent() has been deprecated. Use $ionicLoading.show({ template: \'my content\' }).';

/**
 * @ngdoc service
 * @name $ionicLoading
 * @module ionic
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction.
 *
 * @usage
 * ```js
 * angular.module('LoadingApp', ['ionic'])
 * .controller('LoadingCtrl', function($scope, $ionicLoading) {
 *   $scope.show = function() {
 *     $ionicLoading.show({
 *       template: 'Loading...'
 *     });
 *   };
 *   $scope.hide = function(){
 *     $ionicLoading.hide();
 *   };
 * });
 * ```
 */
/**
 * @ngdoc object
 * @name $ionicLoadingConfig
 * @module ionic
 * @description
 * Set the default options to be passed to the {@link ionic.service:$ionicLoading} service.
 *
 * @usage
 * ```js
 * var app = angular.module('myApp', ['ionic'])
 * app.constant('$ionicLoadingConfig', {
 *   template: 'Default Loading Template...'
 * });
 * app.controller('AppCtrl', function($scope, $ionicLoading) {
 *   $scope.showLoading = function() {
 *     $ionicLoading.show(); //options default to values in $ionicLoadingConfig
 *   };
 * });
 * ```
 */
IonicModule
.constant('$ionicLoadingConfig', {
  template: '<ion-spinner></ion-spinner>'
})
.factory('$ionicLoading', [
  '$ionicLoadingConfig',
  '$ionicBody',
  '$ionicTemplateLoader',
  '$ionicBackdrop',
  '$timeout',
  '$q',
  '$log',
  '$compile',
  '$ionicPlatform',
  '$rootScope',
  'IONIC_BACK_PRIORITY',
function($ionicLoadingConfig, $ionicBody, $ionicTemplateLoader, $ionicBackdrop, $timeout, $q, $log, $compile, $ionicPlatform, $rootScope, IONIC_BACK_PRIORITY) {

  var loaderInstance;
  //default values
  var deregisterBackAction = noop;
  var deregisterStateListener1 = noop;
  var deregisterStateListener2 = noop;
  var loadingShowDelay = $q.when();

  return {
    /**
     * @ngdoc method
     * @name $ionicLoading#show
     * @description Shows a loading indicator. If the indicator is already shown,
     * it will set the options given and keep the indicator shown. Note: While this
     * function still returns an $ionicLoading instance for backwards compatiblity,
     * its use has been deprecated.
     * @param {object} opts The options for the loading indicator. Available properties:
     *  - `{string=}` `template` The html content of the indicator.
     *  - `{string=}` `templateUrl` The url of an html template to load as the content of the indicator.
     *  - `{object=}` `scope` The scope to be a child of. Default: creates a child of $rootScope.
     *  - `{boolean=}` `noBackdrop` Whether to hide the backdrop. By default it will be shown.
     *  - `{boolean=}` `hideOnStateChange` Whether to hide the loading spinner when navigating
     *    to a new state. Default false.
     *  - `{number=}` `delay` How many milliseconds to delay showing the indicator. By default there is no delay.
     *  - `{number=}` `duration` How many milliseconds to wait until automatically
     *  hiding the indicator. By default, the indicator will be shown until `.hide()` is called.
     */
    show: showLoader,
    /**
     * @ngdoc method
     * @name $ionicLoading#hide
     * @description Hides the loading indicator, if shown.
     */
    hide: hideLoader,
    /**
     * @private for testing
     */
    _getLoader: getLoader
  };

  function getLoader() {
    if (!loaderInstance) {
      loaderInstance = $ionicTemplateLoader.compile({
        template: LOADING_TPL,
        appendTo: $ionicBody.get()
      })
      .then(function(self) {
        self.show = function(options) {
          var templatePromise = options.templateUrl ?
            $ionicTemplateLoader.load(options.templateUrl) :
            //options.content: deprecated
            $q.when(options.template || options.content || '');

          self.scope = options.scope || self.scope;

          if (!self.isShown) {
            //options.showBackdrop: deprecated
            self.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
            if (self.hasBackdrop) {
              $ionicBackdrop.retain();
              $ionicBackdrop.getElement().addClass('backdrop-loading');
            }
          }

          if (options.duration) {
            $timeout.cancel(self.durationTimeout);
            self.durationTimeout = $timeout(
              angular.bind(self, self.hide),
              +options.duration
            );
          }

          deregisterBackAction();
          //Disable hardware back button while loading
          deregisterBackAction = $ionicPlatform.registerBackButtonAction(
            noop,
            IONIC_BACK_PRIORITY.loading
          );

          templatePromise.then(function(html) {
            if (html) {
              var loading = self.element.children();
              loading.html(html);
              $compile(loading.contents())(self.scope);
            }

            //Don't show until template changes
            if (self.isShown) {
              self.element.addClass('visible');
              ionic.requestAnimationFrame(function() {
                if (self.isShown) {
                  self.element.addClass('active');
                  $ionicBody.addClass('loading-active');
                }
              });
            }
          });

          self.isShown = true;
        };
        self.hide = function() {

          deregisterBackAction();
          if (self.isShown) {
            if (self.hasBackdrop) {
              $ionicBackdrop.release();
              $ionicBackdrop.getElement().removeClass('backdrop-loading');
            }
            self.element.removeClass('active');
            $ionicBody.removeClass('loading-active');
            self.element.removeClass('visible');
            ionic.requestAnimationFrame(function() {
              !self.isShown && self.element.removeClass('visible');
            });
          }
          $timeout.cancel(self.durationTimeout);
          self.isShown = false;
          var loading = self.element.children();
          loading.html("");
        };

        return self;
      });
    }
    return loaderInstance;
  }

  function showLoader(options) {
    options = extend({}, $ionicLoadingConfig || {}, options || {});
    var delay = options.delay || options.showDelay || 0;

    deregisterStateListener1();
    deregisterStateListener2();
    if (options.hideOnStateChange) {
      deregisterStateListener1 = $rootScope.$on('$stateChangeSuccess', hideLoader);
      deregisterStateListener2 = $rootScope.$on('$stateChangeError', hideLoader);
    }

    //If loading.show() was called previously, cancel it and show with our new options
    $timeout.cancel(loadingShowDelay);
    loadingShowDelay = $timeout(noop, delay);
    loadingShowDelay.then(getLoader).then(function(loader) {
      return loader.show(options);
    });

    return {
      hide: function deprecatedHide() {
        $log.error(LOADING_HIDE_DEPRECATED);
        return hideLoader.apply(this, arguments);
      },
      show: function deprecatedShow() {
        $log.error(LOADING_SHOW_DEPRECATED);
        return showLoader.apply(this, arguments);
      },
      setContent: function deprecatedSetContent(content) {
        $log.error(LOADING_SET_DEPRECATED);
        return getLoader().then(function(loader) {
          loader.show({ template: content });
        });
      }
    };
  }

  function hideLoader() {
    deregisterStateListener1();
    deregisterStateListener2();
    $timeout.cancel(loadingShowDelay);
    getLoader().then(function(loader) {
      loader.hide();
    });
  }
}]);
