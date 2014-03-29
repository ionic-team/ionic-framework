angular.module('ionic.service.loading', ['ionic.ui.loading'])

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
 *     $scope.loading = $ionicLoading.show({
 *       content: 'Loading',
 *     });
 *   };
 *   $scope.hide = function(){
 *     $scope.loading.hide();
 *   };
 * });
 * ```
 */
.factory('$ionicLoading', ['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
  return {
    /**
     * @ngdoc method
     * @name $ionicLoading#show
     * @param {object} opts The options for the indicator. Available properties:
     *  - `{string=}` `content` The content of the indicator. Default: none.
     *  - `{string=}` `animation` The animation of the indicator.
     *    Default: 'fade-in'.
     *  - `{boolean=}` `showBackdrop` Whether to show a backdrop. Default: true.
     *  - `{number=}` `maxWidth` The maximum width of the indicator, in pixels.
     *    Default: 200.
     *  - `{number=}` `showDelay` How many milliseconds to delay showing the
     *    indicator.  Default: 0.
     * @returns {object} A shown loader with the following methods:
     *  - `hide()` - Hides the loader.
     *  - `show()` - Shows the loader.
     *  - `setContent(string)` - Sets the html content of the loader.
     */
    show: function(opts) {
      var defaults = {
        content: '',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      };

      opts = angular.extend(defaults, opts);

      var scope = $rootScope.$new(true);
      angular.extend(scope, opts);

      // Make sure there is only one loading element on the page at one point in time
      var existing = angular.element($document[0].querySelector('.loading-backdrop'));
      if(existing.length) {
        existing.remove();
      }

      // Compile the template
      var element = $compile('<ion-loading>' + opts.content + '</ion-loading>')(scope);

      $document[0].body.appendChild(element[0]);

      var loading = new ionic.views.Loading({
        el: element[0],
        maxWidth: opts.maxWidth,
        showDelay: opts.showDelay
      });

      loading.show();

      scope.loading = loading;

      return loading;
    }
  };
}]);
