/**
 * @ngdoc service
 * @name $ionicSlidesDelegate
 * @module ionic
 * @description
 * Delegate that controls the {@link ionic.directive:ionSlides} directive.
 *
 * Methods called directly on the $ionicSlidesDelegate service will control all slide.  Use the {@link ionic.service:$ionicSlidesDelegate#$getByHandle $getByHandle}
 * method to control specific slide box instances.
 *
 * @usage
 *
 * ```html
 * <ion-view>
 *   <ion-slides>
 *     <ion-slide-page
 *       <div class="box blue">
 *         <button ng-click="nextSlide()">Next slide!</button>
 *       </div>
 *     </ion-slide-page
 *     <ion-slide-page
 *       <div class="box red">
 *         Slide 2!
 *       </div>
 *     </ion-slide-page
 *   </ion-slides>
 * </ion-view>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicSlidesDelegate) {
 *   $scope.nextSlide = function() {
 *     $ionicSlidesDelegate.next();
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicSlidesDelegate', ionic.DelegateService([
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#update
   * @description
   * Update the slides (for example if using Angular with ng-repeat,
   * resize it for the elements inside).
   */
  'update',
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#slideTo
   * @param {number} to The index to slide to.
   * @param {number=} speed The number of milliseconds the change should take.
   */
  'slideTo',
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#lockSwipes
   * @description
   * Lock the slides, prevent being able to change the slide
   */
  'lockSwipes',
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#unlockSwipes
   * @description
   * Unlock the slides
   */
  'unlockSwipes',
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#slidePrev
   * @param {bool} emitEvent Whether the slide change should emit a start/end event
   * @param {number=} speed The number of milliseconds the change should take.
   * @description Go to the previous slide.
   */
  'slidePrev',
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#slideNext
   * @param {bool} emitEvent Whether the slide change should emit a start/end event
   * @param {number=} speed The number of milliseconds the change should take.
   * @description Go to the next slide.
   */
  'slideNext',
  /**
   * @ngdoc method
   * @name $ionicSlidesDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionSlides} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicSlidesDelegate.$getByHandle('my-handle').stop();`
   */
]));
