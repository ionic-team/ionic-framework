(function() {
'use strict';

/**
 * @description
 * The slideBoxCtrol lets you quickly create a multi-page 
 * container where each page can be swiped or dragged between
 */

angular.module('ionic.ui.slideBox', [])

/**
 * The internal controller for the slide box controller.
 */

.directive('slideBox', ['$timeout', '$compile', function($timeout, $compile) {
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
      activeSlide: '='
    },
    controller: ['$scope', '$element', function($scope, $element) {
      var _this = this;

      var continuous = $scope.$eval($scope.doesContinue) === true;
      var slideInterval = continuous ? $scope.$eval($scope.slideInterval) || 4000 : 0;

      var slider = new ionic.views.Slider({
        el: $element[0],
        auto: slideInterval,
        disableScroll: ($scope.$eval($scope.disableScroll) === true) || false,
        continuous: continuous,
        slidesChanged: function() {
          $scope.currentSlide = slider.getPos();

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

      $scope.$parent.slideBox = slider;

      this.getNumSlides = function() {
        return slider.getNumSlides();
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
        var pager = angular.element('<pager></pager>');
        $element.append(pager);
        $compile(pager)(childScope);
      }
    }
  };
}])

.directive('slide', function() {
  return {
    restrict: 'E',
    require: '^slideBox',
    compile: function(element, attr) {
      element.addClass('slider-slide');
      return function($scope, $element, $attr) {};
    },
  };
})

.directive('pager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^slideBox',
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
        return new Array(slideBox.getNumSlides());
      };

      $scope.$watch('currentSlide', function(v) {
        selectPage(v);
      });
    }
  };

});

})();
