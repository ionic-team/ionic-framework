
var TPL_LOADING =
  '<div class="loading ng-hide">' +
  '</div>';

var HIDE_LOADING_DEPRECATED = '$ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().';
var SHOW_LOADING_DEPRECATED = '$ionicLoading instance.show() has been deprecated. Use $ionicLoading.show().';
var SET_LOADING_DEPRECATED = '$ionicLoading instance.setContent() has been deprecated. Use $ionicLoading.show({ template: \'my content\' }).';
var CONTENT_LOADING_DEPRECATED = '$ionicLoading options.content has been deprecated. Use options.template or options.templateUrl instead.';
var SHOW_DELAY_LOADING_DEPRECATED = '$ionicLoading options.showDelay has been deprecated. Use options.delay instead.';
var SHOW_BACKDROP_LOADING_DEPRECATED = '$ionicLoading options.showBackdrop has been deprecated. Use options.noBackdrop instead.';

angular.module('ionic.service.loading', [])

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
.factory('$ionicLoading', [
  '$animate',
  '$document',
  '$ionicTemplateLoader',
  '$ionicBackdrop',
  '$timeout',
  '$q',
  '$log',
  '$compile',
function($animate, $document, $ionicTemplateLoader, $ionicBackdrop, $timeout, $q, $log, $compile) {

  var loaderInstance;
  //default value
  var loadingShowDelay = $q.when();

  return {
    /**
     * @ngdoc method
     * @name $ionicLoading#show
     * @description Shows a loading indicator. If the indicator is already shown,
     * it will set the options given and keep the indicator shown.
     * @param {object} opts The options for the loading indicator. Available properties:
     *  - `{string=}` `template` The html content of the indicator.
     *  - `{string=}` `templateUrl` The url of an html template to load as the content of the indicator.
     *  - `{boolean=}` `noBackdrop` Whether to hide the backdrop.
     *  - `{number=}` `delay` How many milliseconds to delay showing the indicator.
     *  - `{number=} `duration` How many milliseconds to wait until automatically
     *  hiding the indicator.
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
        template: TPL_LOADING,
        appendTo: $document[0].body
      })
      .then(function(loader) {
        loader.show = function(options) {
          var self = this;
          var templatePromise = options.templateUrl ?
            $ionicTemplateLoader.load(options.templateUrl) :
            $q.when(options.template || options.content || '');

          if (!this.isShown) {
            this.hasBackdrop = !options.noBackdrop || options.showBackdrop === false;
            if (this.hasBackdrop) {
              $ionicBackdrop.retain();
            }
          }

          if (options.duration) {
            $timeout.cancel(this.durationTimeout);
            this.durationTimeout = $timeout(
              angular.bind(this, this.hide),
              +options.duration
            );
          }

          templatePromise.then(function(html) {
            if (html) {
              self.element.html(html);
              $compile(self.element.contents())(self.scope);
            }
          });

          ionic.requestAnimationFrame(function() {
            $animate.removeClass(self.element, 'ng-hide');
            //Fix for ios: if we center the element twice, it always gets
            //position right. Otherwise, it doesn't
            ionic.DomUtil.centerElementByMargin(self.element[0]);
            //One frame after it's visible, position it
            ionic.requestAnimationFrame(function() {
              ionic.DomUtil.centerElementByMargin(self.element[0]);
            });
          });

          this.isShown = true;
        };
        loader.hide = function() {
          if (this.isShown) {
            if (this.hasBackdrop) {
              $ionicBackdrop.release();
            }
            $animate.addClass(this.element, 'ng-hide');
          }
          $timeout.cancel(this.durationTimeout);
          this.isShown = false;
        };
        return loader;
      });
    }
    return $q.when(loaderInstance);
  }

  function showLoader(options) {
    options || (options = {});

    deprecated.field(CONTENT_LOADING_DEPRECATED, $log.warn, options, 'content', options.content);
    deprecated.field(SHOW_DELAY_LOADING_DEPRECATED, $log.warn, options, 'showDelay', options.showDelay);
    deprecated.field(SHOW_BACKDROP_LOADING_DEPRECATED, $log.warn, options, 'showBackdrop', options.showBackdrop);

    loadingShowDelay = $timeout(getLoader, options.delay || options.showDelay || 0)
    .then(function(loader) {
      return loader.show(options);
    });

    return {
      hide: deprecated.method(HIDE_LOADING_DEPRECATED, $log.warn, hideLoader),
      show: deprecated.method(SHOW_LOADING_DEPRECATED, $log.warn, function() {
        showLoader(options);
      }),
      setContent: deprecated.method(SET_LOADING_DEPRECATED, $log.warn, function(content) {
        getLoader().then(function(loader) {
          loader.scope.html = content;
        });
      })
    };
  }

  function hideLoader() {
    loadingShowDelay.then(getLoader).then(function(loader) {
      loader.hide();
    });
  }
}]);
