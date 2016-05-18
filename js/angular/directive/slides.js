
/**
 * @ngdoc directive
 * @name ionSlides
 * @module ionic
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slides component is a powerful multi-page container where each page can be swiped or dragged between.
 *
 * Note: this is a new version of the Ionic Slide Box based on the [Swiper](http://www.idangero.us/swiper/#.Vmc1J-ODFBc) widget from
 * [idangerous](http://www.idangero.us/).
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * @usage
 * ```html
 * <ion-content scroll="false">
 *   <ion-slides  options="options" slider="data.slider">
 *     <ion-slide-page>
 *       <div class="box blue"><h1>BLUE</h1></div>
 *     </ion-slide-page>
 *     <ion-slide-page>
 *       <div class="box yellow"><h1>YELLOW</h1></div>
 *     </ion-slide-page>
 *     <ion-slide-page>
 *       <div class="box pink"><h1>PINK</h1></div>
 *     </ion-slide-page>
 *   </ion-slides>
 * </ion-content>
 * ```
 *
 * ```js
 * $scope.options = {
 *   loop: false,
 *   effect: 'fade',
 *   speed: 500,
 * }
 *
 * $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
 *   // data.slider is the instance of Swiper
 *   $scope.slider = data.slider;
 * });
 *
 * $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
 *   console.log('Slide change is beginning');
 * });
 *
 * $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
 *   // note: the indexes are 0-based
 *   $scope.activeIndex = data.slider.activeIndex;
 *   $scope.previousIndex = data.slider.previousIndex;
 * });
 *
 * ```
 *
 * ## Slide Events
 *
 * The slides component dispatches events when the active slide changes
 *
 * <table class="table">
 *   <tr>
 *     <td><code>$ionicSlides.slideChangeStart</code></td>
 *     <td>This event is emitted when a slide change begins</td>
 *   </tr>
 *   <tr>
 *     <td><code>$ionicSlides.slideChangeEnd</code></td>
 *     <td>This event is emitted when a slide change completes</td>
 *   </tr>
 *   <tr>
 *     <td><code>$ionicSlides.sliderInitialized</code></td>
 *     <td>This event is emitted when the slider is initialized. It provides access to an instance of the slider.</td>
 *   </tr>
 * </table>
 *
 *
 * ## Updating Slides Dynamically
 * When applying data to the slider at runtime, typically everything will work as expected.
 *
 * In the event that the slides are looped, use the `updateLoop` method on the slider to ensure the slides update correctly.
 *
 * ```
 * $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
 *   // grab an instance of the slider
 *   $scope.slider = data.slider;
 * });
 *
 * function dataChangeHandler(){
 *   // call this function when data changes, such as an HTTP request, etc
 *   if ( $scope.slider ){
 *     $scope.slider.updateLoop();
 *   }
 * }
 * ```
 *
 */
IonicModule
.directive('ionSlides', [
  '$animate',
  '$timeout',
  '$compile',
function($animate, $timeout, $compile) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      options: '=',
      slider: '='
    },
    template: '<div class="swiper-container">' +
      '<div class="swiper-wrapper" ng-transclude>' +
      '</div>' +
        '<div ng-hide="!showPager" class="swiper-pagination"></div>' +
      '</div>',
    controller: ['$scope', '$element', function($scope, $element) {
      var _this = this;

      this.update = function() {
        $timeout(function() {
          if (!_this.__slider) {
            return;
          }

          _this.__slider.update();
          if (_this._options.loop) {
            _this.__slider.createLoop();
          }

          var slidesLength = _this.__slider.slides.length;

          // Don't allow pager to show with > 10 slides
          if (slidesLength > 10) {
            $scope.showPager = false;
          }

          // When slide index is greater than total then slide to last index
          if (_this.__slider.activeIndex > slidesLength - 1) {
            _this.__slider.slideTo(slidesLength - 1);
          }
        });
      };

      this.rapidUpdate = ionic.debounce(function() {
        _this.update();
      }, 50);

      this.getSlider = function() {
        return _this.__slider;
      };

      var options = $scope.options || {};

      var newOptions = angular.extend({
        pagination: $element.children().children()[1],
        paginationClickable: true,
        lazyLoading: true,
        preloadImages: false
      }, options);

      this._options = newOptions;

      $timeout(function() {
        var slider = new ionic.views.Swiper($element.children()[0], newOptions, $scope, $compile);

        $scope.$emit("$ionicSlides.sliderInitialized", { slider: slider });

        _this.__slider = slider;
        $scope.slider = _this.__slider;

        $scope.$on('$destroy', function() {
          slider.destroy();
          _this.__slider = null;
        });
      });

      $timeout(function() {
        // if it's a loop, render the slides again just incase
        _this.rapidUpdate();
      }, 200);

    }],

    link: function($scope) {
      $scope.showPager = true;
      // Disable ngAnimate for slidebox and its children
      //$animate.enabled(false, $element);
    }
  };
}])
.directive('ionSlidePage', [function() {
  return {
    restrict: 'E',
    require: '?^ionSlides',
    transclude: true,
    replace: true,
    template: '<div class="swiper-slide" ng-transclude></div>',
    link: function($scope, $element, $attr, ionSlidesCtrl) {
      ionSlidesCtrl.rapidUpdate();

      $scope.$on('$destroy', function() {
        ionSlidesCtrl.rapidUpdate();
      });
    }
  };
}]);
