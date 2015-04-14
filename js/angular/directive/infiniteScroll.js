/**
 * @ngdoc directive
 * @name ionInfiniteScroll
 * @module ionic
 * @parent ionic.directive:ionContent, ionic.directive:ionScroll
 * @restrict E
 *
 * @description
 * The ionInfiniteScroll directive allows you to call a function whenever
 * the user gets to the bottom of the page or near the bottom of the page.
 *
 * The expression you pass in for `on-infinite` is called when the user scrolls
 * greater than `distance` away from the bottom of the content.  Once `on-infinite`
 * is done loading new data, it should broadcast the `scroll.infiniteScrollComplete`
 * event from your controller (see below example).
 *
 * @param {expression} on-infinite What to call when the scroller reaches the
 * bottom.
 * @param {string=} distance The distance from the bottom that the scroll must
 * reach to trigger the on-infinite expression. Default: 1%.
 * @param {string=} spinner The {@link ionic.directive:ionSpinner} to show while loading. The SVG
 * {@link ionic.directive:ionSpinner} is now the default, replacing rotating font icons.
 * @param {string=} icon The icon to show while loading. Default: 'ion-load-d'.  This is depreicated
 * in favor of the SVG {@link ionic.directive:ionSpinner}.
 * @param {boolean=} immediate-check Whether to check the infinite scroll bounds immediately on load.
 *
 * @usage
 * ```html
 * <ion-content ng-controller="MyController">
 *   <ion-list>
 *   ....
 *   ....
 *   </ion-list>
 *
 *   <ion-infinite-scroll
 *     on-infinite="loadMore()"
 *     distance="1%">
 *   </ion-infinite-scroll>
 * </ion-content>
 * ```
 * ```js
 * function MyController($scope, $http) {
 *   $scope.items = [];
 *   $scope.loadMore = function() {
 *     $http.get('/more-items').success(function(items) {
 *       useItems(items);
 *       $scope.$broadcast('scroll.infiniteScrollComplete');
 *     });
 *   };
 *
 *   $scope.$on('$stateChangeSuccess', function() {
 *     $scope.loadMore();
 *   });
 * }
 * ```
 *
 * An easy to way to stop infinite scroll once there is no more data to load
 * is to use angular's `ng-if` directive:
 *
 * ```html
 * <ion-infinite-scroll
 *   ng-if="moreDataCanBeLoaded()"
 *   icon="ion-loading-c"
 *   on-infinite="loadMoreData()">
 * </ion-infinite-scroll>
 * ```
 */
IonicModule
.directive('ionInfiniteScroll', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    require: ['?^$ionicScroll', 'ionInfiniteScroll'],
    template: function($element, $attrs) {
      if ($attrs.icon) return '<i class="icon {{icon()}} icon-refreshing {{scrollingType}}"></i>';
      return '<ion-spinner icon="{{spinner()}}"></ion-spinner>';
    },
    scope: true,
    controller: '$ionInfiniteScroll',
    link: function($scope, $element, $attrs, ctrls) {
      var infiniteScrollCtrl = ctrls[1];
      var scrollCtrl = infiniteScrollCtrl.scrollCtrl = ctrls[0];
      var jsScrolling = infiniteScrollCtrl.jsScrolling = !scrollCtrl.isNative();

      // if this view is not beneath a scrollCtrl, it can't be injected, proceed w/ native scrolling
      if (jsScrolling) {
        infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;
        $scope.scrollingType = 'js-scrolling';
        //bind to JS scroll events
        scrollCtrl.$element.on('scroll', infiniteScrollCtrl.checkBounds);
      } else {
        // grabbing the scrollable element, to determine dimensions, and current scroll pos
        var scrollEl = ionic.DomUtil.getParentOrSelfWithClass($element[0].parentNode, 'overflow-scroll');
        infiniteScrollCtrl.scrollEl = scrollEl;
        // if there's no scroll controller, and no overflow scroll div, infinite scroll wont work
        if (!scrollEl) {
          throw 'Infinite scroll must be used inside a scrollable div';
        }
        //bind to native scroll events
        infiniteScrollCtrl.scrollEl.addEventListener('scroll', infiniteScrollCtrl.checkBounds);
      }

      // Optionally check bounds on start after scrollView is fully rendered
      var doImmediateCheck = isDefined($attrs.immediateCheck) ? $scope.$eval($attrs.immediateCheck) : true;
      if (doImmediateCheck) {
        $timeout(function() { infiniteScrollCtrl.checkBounds(); });
      }
    }
  };
}]);
