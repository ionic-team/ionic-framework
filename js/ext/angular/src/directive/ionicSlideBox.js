(function() {
'use strict';

angular.module('ionic.ui.slideBox', [])

/**
 * The internal controller for the slide box controller.
 */

/**
 * @ngdoc directive
 * @name ionSlideBox
 * @module ionic
 * @restrict E
 * @controller ionicSlideBox as $scope.$ionicSlideBoxController
 * @description
 * The Slide Box is a multi-page container where each page can be swiped or dragged between:
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * @usage
 * ```html
 * <ion-slide-box>
 *   <ion-slide>
 *     <div class="box blue"><h1>BLUE</h1></div>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="box yellow"><h1>YELLOW</h1></div>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="box pink"><h1>PINK</h1></div>
 *   </ion-slide>
 * </ion-slide-box>
 * ```
 *
 * @param {string=} controller-bind The scope variable to bind this slide box's
 * {@link ionic.controller:ionicSlideBox ionicSlideBox controller} to.
 * Default: $scope.$ionicSlideBoxController.
 * @param {boolean=} does-continue Whether the slide box should automatically slide.
 * @param {number=} slide-interval How many milliseconds to wait to change slides (if does-continue is true). Defaults to 4000.
 * @param {boolean=} show-pager Whether a pager should be shown for this slide box.
 * @param {boolean=} disable-scroll Whether to disallow scrolling/dragging of the slide-box content.
 * @param {expression=} on-slide-changed Expression called whenever the slide is changed.
 * @param {expression=} active-slide Model to bind the current slide to.
 */
.directive('ionSlideBox', ['$timeout', '$compile', function($timeout, $compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      doesContinue: '@',
      slideInterval: '@',
      showPager: '@',
      disableScroll: '@',
      onSlideChanged: '&',
      activeSlide: '=?'
    },
    controller: ['$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
      var _this = this;

      var continuous = $scope.$eval($scope.doesContinue) === true;
      var slideInterval = continuous ? $scope.$eval($scope.slideInterval) || 4000 : 0;

      var slider = new ionic.views.Slider({
        el: $element[0],
        auto: slideInterval,
        disableScroll: ($scope.$eval($scope.disableScroll) === true) || false,
        continuous: continuous,
        startSlide: $scope.activeSlide,
        slidesChanged: function() {
          $scope.currentSlide = slider.currentIndex();

          // Try to trigger a digest
          $timeout(function() {});
        },
        callback: function(slideIndex) {
          $scope.currentSlide = slideIndex;
          $scope.onSlideChanged({index:$scope.currentSlide});
          $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
          $scope.activeSlide = slideIndex;
          // Try to trigger a digest
          $timeout(function() {});
        }
      });

      $scope.$watch('activeSlide', function(nv) {
        if(angular.isDefined(nv)){
          slider.slide(nv);
        }
      });

      $scope.$on('slideBox.nextSlide', function() {
        slider.next();
      });

      $scope.$on('slideBox.prevSlide', function() {
        slider.prev();
      });

      $scope.$on('slideBox.setSlide', function(e, index) {
        slider.slide(index);
      });

      $parse($attrs.controllerBind || '$ionicSlideBoxController').assign($scope.$parent, slider);

      this.slidesCount = function() {
        return slider.slidesCount();
      };

      $timeout(function() {
        slider.load();
      });
    }],
    template: '<div class="slider">\
            <div class="slider-slides" ng-transclude>\
            </div>\
          </div>',

    link: function($scope, $element, $attr, slideBoxCtrl) {
      // If the pager should show, append it to the slide box
      if($scope.$eval($scope.showPager) !== false) {
        var childScope = $scope.$new();
        var pager = angular.element('<ion-pager></ion-pager>');
        $element.append(pager);
        $compile(pager)(childScope);
      }
    }
  };
}])

.directive('ionSlide', function() {
  return {
    restrict: 'E',
    require: '^ionSlideBox',
    compile: function(element, attr) {
      element.addClass('slider-slide');
      return function($scope, $element, $attr) {};
    },
  };
})

.directive('ionPager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^ionSlideBox',
    template: '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}"><i class="icon ion-record"></i></span></div>',
    link: function($scope, $element, $attr, slideBox) {
      var selectPage = function(index) {
        var children = $element[0].children;
        var length = children.length;
        for(var i = 0; i < length; i++) {
          if(i == index) {
            children[i].classList.add('active');
          } else {
            children[i].classList.remove('active');
          }
        }
      };

      $scope.numSlides = function() {
        return new Array(slideBox.slidesCount());
      };

      $scope.$watch('currentSlide', function(v) {
        selectPage(v);
      });
    }
  };

});

})();
