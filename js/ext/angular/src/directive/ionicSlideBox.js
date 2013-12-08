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

.directive('slideBox', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {},
    controller: ['$scope', '$element', function($scope, $element) {
      $scope.slides = [];
      this.slideAdded = function() {
        $scope.slides.push({});
      };

      angular.extend(this, ionic.views.SlideBox.prototype);

      ionic.views.SlideBox.call(this, {
        el: $element[0],
        slideChanged: function(slideIndex) {
          $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
          $scope.$apply();
        }
      });

      $scope.$parent.slideBox = this;
    }],
    template: '<div class="slide-box">\
            <div class="slide-box-slides" ng-transclude>\
            </div>\
          </div>',

    link: function($scope, $element, $attr, slideBoxCtrl) {
      // If the pager should show, append it to the slide box
      if($attr.showPager !== "false") {
        var childScope = $scope.$new();
        var pager = $compile('<pager></pager>')(childScope);
        $element.append(pager);
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
    template: '<div class="slide-box-slide" ng-transclude></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, slideBoxCtrl) {
        slideBoxCtrl.slideAdded();
      };
    }
  };
})

.directive('pager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^slideBox',
    template: '<div class="slide-box-pager"><span ng-repeat="slide in slides"><i class="icon ion-record"></i></span></div>'
  };

});

})();
