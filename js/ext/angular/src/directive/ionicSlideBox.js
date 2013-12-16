(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.slideBox', [])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */

.directive('slideBox', ['$timeout', '$compile', function($timeout, $compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      showPager: '@',
      onSlideChanged: '&'
    },
    controller: ['$scope', '$element', function($scope, $element) {
      var _this = this;

      var slider = new ionic.views.Slider({
        el: $element[0],
        slidesChanged: function() {
          $scope.currentSlide = slider.getPos();

          // Occasionally we need to trigger a digest
          $timeout(function() {});
        },
        callback: function(slideIndex) {
          $scope.currentSlide = slideIndex;
          $scope.onSlideChanged({index:$scope.currentSlide});
          $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
          $scope.$apply();
        }
      });


      $scope.slider = slider;

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
    replace: true,
    require: '^slideBox',
    transclude: true,
    template: '<div class="slider-slide" ng-transclude></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, slideBoxCtrl) {
      };
    }
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
        return new Array($scope.slider.getNumSlides());
      };

      $scope.$watch('currentSlide', function(v) {
        console.log('Current slide', v);
        selectPage(v);
      });
    }
  };

});

})();
