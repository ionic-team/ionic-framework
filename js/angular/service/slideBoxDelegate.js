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
 * <ion-view>
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
 * </ion-view>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicSlideBoxDelegate) {
 *   $scope.nextSlide = function() {
 *     $ionicSlideBoxDelegate.next();
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicSlideBoxDelegate', ionic.DelegateService([
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#update
   * @description
   * Update the slidebox (for example if using Angular with ng-repeat,
   * resize it for the elements inside).
   */
  'update',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#slide
   * @param {number} to The index to slide to.
   * @param {number=} speed The number of milliseconds the change should take.
   */
  'slide',
  'select',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#enableSlide
   * @param {boolean=} shouldEnable Whether to enable sliding the slidebox.
   * @returns {boolean} Whether sliding is enabled.
   */
  'enableSlide',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#previous
   * @param {number=} speed The number of milliseconds the change should take.
   * @description Go to the previous slide. Wraps around if at the beginning.
   */
  'previous',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#next
   * @param {number=} speed The number of milliseconds the change should take.
   * @description Go to the next slide. Wraps around if at the end.
   */
  'next',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#stop
   * @description Stop sliding. The slideBox will not move again until
   * explicitly told to do so.
   */
  'stop',
  'autoPlay',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#start
   * @description Start sliding again if the slideBox was stopped.
   */
  'start',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#currentIndex
   * @returns number The index of the current slide.
   */
  'currentIndex',
  'selected',
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#slidesCount
   * @returns number The number of slides there are currently.
   */
  'slidesCount',
  'count',
  'loop'
  /**
   * @ngdoc method
   * @name $ionicSlideBoxDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionSlideBox} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicSlideBoxDelegate.$getByHandle('my-handle').stop();`
   */
]));

