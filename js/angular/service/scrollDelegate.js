
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
.service('$ionicScrollDelegate', delegateService([
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
   * @name $ionicScrollDelegate#getScrollView
   * @returns {object} The scrollView associated with this delegate.
   */
  'getScrollView',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#rememberScrollPosition
   * @description
   * Will make it so, when this scrollView is destroyed (user leaves the page),
   * the last scroll position the page was on will be saved, indexed by the
   * given id.
   *
   * Note: for pages associated with a view under an ion-nav-view,
   * rememberScrollPosition automatically saves their scroll.
   *
   * Related methods: scrollToRememberedPosition, forgetScrollPosition (below).
   *
   * In the following example, the scroll position of the ion-scroll element
   * will persist, even when the user changes the toggle switch.
   *
   * ```html
   * <ion-toggle ng-model="shouldShowScrollView"></ion-toggle>
   * <ion-scroll delegate-handle="myScroll" ng-if="shouldShowScrollView">
   *   <div ng-controller="ScrollCtrl">
   *     <ion-list>
   *       {% raw %}<ion-item ng-repeat="i in items">{{i}}</ion-item>{% endraw %}
   *     </ion-list>
   *   </div>
   * </ion-scroll>
   * ```
   * ```js
   * function ScrollCtrl($scope, $ionicScrollDelegate) {
   *   var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
   *
   *   // Put any unique ID here.  The point of this is: every time the controller is recreated
   *   // we want to load the correct remembered scroll values.
   *   delegate.rememberScrollPosition('my-scroll-id');
   *   delegate.scrollToRememberedPosition();
   *   $scope.items = [];
   *   for (var i=0; i<100; i++) {
   *     $scope.items.push(i);
   *   }
   * }
   * ```
   *
   * @param {string} id The id to remember the scroll position of this
   * scrollView by.
   */
  'rememberScrollPosition',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#forgetScrollPosition
   * @description
   * Stop remembering the scroll position for this scrollView.
   */
  'forgetScrollPosition',
  /**
   * @ngdoc method
   * @name $ionicScrollDelegate#scrollToRememberedPosition
   * @description
   * If this scrollView has an id associated with its scroll position,
   * (through calling rememberScrollPosition), and that position is remembered,
   * load the position and scroll to it.
   * @param {boolean=} shouldAnimate Whether to animate the scroll.
   */
  'scrollToRememberedPosition'
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

