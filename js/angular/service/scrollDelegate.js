
/**
 * @ngdoc service
 * @name $ionicScrollDelegate
 * @module ionic
 * @description
 * Delegate for controlling scrollViews (created by
 * {@link ionic.directive:ionContent} and
 * {@link ionic.directive:ionScroll} directives).
 *
 * Methods called directly on the $ionicScrollDelegate service will control all scroll
 * views.  Use the {@link ionic.service:$ionicScrollDelegate#$getByHandle $getByHandle}
 * method to control specific scrollViews.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <ion-content>
 *     <button ng-click="scrollTop()">Scroll to Top!</button>
 *   </ion-content>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $ionicScrollDelegate) {
 *   $scope.scrollTop = function() {
 *     $ionicScrollDelegate.scrollTop();
 *   };
 * }
 * ```
 *
 * Example of advanced usage, with two scroll areas using `delegate-handle`
 * for fine control.
 *
 * ```html
 * <body ng-controller="MainCtrl">
 *   <ion-content delegate-handle="mainScroll">
 *     <button ng-click="scrollMainToTop()">
 *       Scroll content to top!
 *     </button>
 *     <ion-scroll delegate-handle="small" style="height: 100px;">
 *       <button ng-click="scrollSmallToTop()">
 *         Scroll small area to top!
 *       </button>
 *     </ion-scroll>
 *   </ion-content>
 * </body>
 * ```
 * ```js
 * function MainCtrl($scope, $ionicScrollDelegate) {
 *   $scope.scrollMainToTop = function() {
 *     $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
 *   };
 *   $scope.scrollSmallToTop = function() {
 *     $ionicScrollDelegate.$getByHandle('small').scrollTop();
 *   };
 * }
 * ```
 */
IonicModule
.service('$ionicScrollDelegate', ionic.DelegateService([
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#resize
   * @description Tell the scrollView to recalculate the size of its container.
   */
  'resize',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollTop
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollTop',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollBottom
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollBottom',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollTo
   * @param {number} left The x-value to scroll to.
   * @param {number} top The y-value to scroll to.
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollTo',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollBy
   * @param {number} left The x-offset to scroll by.
   * @param {number} top The y-offset to scroll by.
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'scrollBy',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#zoomTo
   * @param {number} level Level to zoom to.
   * @param {boolean=} animate Whether to animate the zoom.
   * @param {number=} originLeft Zoom in at given left coordinate.
   * @param {number=} originTop Zoom in at given top coordinate.
   */
  'zoomTo',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#zoomBy
   * @param {number} factor The factor to zoom by.
   * @param {boolean=} animate Whether to animate the zoom.
   * @param {number=} originLeft Zoom in at given left coordinate.
   * @param {number=} originTop Zoom in at given top coordinate.
   */
  'zoomBy',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#getScrollPosition
   * @returns {object} The scroll position of this view, with the following properties:
   *  - `{number}` `left` The distance the user has scrolled from the left (starts at 0).
   *  - `{number}` `top` The distance the user has scrolled from the top (starts at 0).
   */
  'getScrollPosition',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#anchorScroll
   * @description Tell the scrollView to scroll to the element with an id
   * matching window.location.hash.
   *
   * If no matching element is found, it will scroll to top.
   *
   * @param {boolean=} shouldAnimate Whether the scroll should animate.
   */
  'anchorScroll',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#freezeScroll
   * @description Does not allow this scroll view to scroll either x or y.
   * @param {boolean=} shouldFreeze Should this scroll view be prevented from scrolling or not.
   * @returns {boolean} If the scroll view is being prevented from scrolling or not.
   */
  'freezeScroll',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#freezeAllScrolls
   * @description Does not allow any of the app's scroll views to scroll either x or y.
   * @param {boolean=} shouldFreeze Should all app scrolls be prevented from scrolling or not.
   */
  'freezeAllScrolls',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#getScrollView
   * @returns {object} The scrollView associated with this delegate.
   */
  'getScrollView'
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * scrollViews with `delegate-handle` matching the given handle.
   *
   * Example: `$ionicScrollDelegate.$getByHandle('my-handle').scrollTop();`
   */
]));

