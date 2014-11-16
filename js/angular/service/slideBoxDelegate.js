/**
 * @ngdoc service
 * @name $ionicSlideBoxDelegate
 * @module ionic
 * @description
 * Delegate that controls the {@link ionic.directive:ionSlideBox} directive.
 *
 * Methods called directly on the $ionicSlideBoxDelegate service will control all slide boxes.  Use the {@link ionic.service:$ionicSlideBoxDelegate#$getByHandle $getByHandle}
 * method to control specific slide box instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <ion-slide-box>
 *     <ion-slide>
 *       <div class="box blue">
 *         <button ng-click="nextSlide()">Next slide!</button>
 *       </div>
 *     </ion-slide>
 *     <ion-slide>
 *       <div class="box red">
 *         Slide 2!
 *       </div>
 *     </ion-slide>
 *   </ion-slide-box>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicSlideBoxDelegate) {
 *   $scope.nextSlide = function() {
 *     $ionicSlideBoxDelegate.select( $ionicSlideBoxDelegate.next() );
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicSlideBoxDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#select
   * @param {number} slideIndex The index to select.
   */
  'select',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#selected
   * @returns `slideIndex` The index of the currently selected slide.
   */
  'selected',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#loop
   * @description Sets/gets the looping state of the slidebox (whether going next from the last slide will go back to the first slide, and vice versa).
   * @param {boolean=} shouldLoop Set whether the slidebox should loop.
   * @returns `isLoop` Whether looping is currently enabled.
   */
 'loop',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#previous
   * @returns `slideIndex` The index of the previous slide. Wraps around if loop is enabled.
   */
  'previous',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#next
   * @returns `slideIndex` The index of the next slide. Wraps around if loop is enabled.
   */
  'next',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#autoPlay
   * @description Set whether the slidebox should automatically play, and at what rate.
   * @param {*} autoPlayInterval How many milliseconds delay until changing to the next slide.
   * Set to zero or false to stop autoPlay.
   */
  'autoPlay',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#enableSlide
   * @param {boolean=} shouldEnable Whether to enable sliding the slidebox.
   * @returns `boolean` Whether sliding is enabled.
   */
  'enableSlide',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#count
   * @returns `number` The number of slides there are currently.
   */
  'count',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionSlideBox} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicSlideBoxDelegate.$getByHandle('my-handle').select(0);`
   */
]));

