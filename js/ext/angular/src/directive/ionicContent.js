(function() {
'use strict';

angular.module('ionic.ui.content', [])

.directive('pane', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="pane" ng-transclude></div>'
  }
})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-content"><div class="scroll"></div></div>',
    transclude: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var c = $element.eq(0);

        if(attr.padded) {
          c.addClass('padding');
        }

        if(attr.hasHeader) {
          c.addClass('has-header');
        }
        if(attr.hasFooter) {
          c.addClass('has-footer');
        }
        if(attr.hasTabs) {
          c.addClass('has-tabs');
        }


        // If they want plain overflows scrolling, add that as a class
        if(attr.overflowScroll === "true") {
          c.addClass('overflow-scroll');
        } else {
          // Otherwise, supercharge this baby!
          var sv = new ionic.views.Scroll({
            el: $element[0].firstElementChild
          });
          // Let child scopes access this 
          $scope.scrollView = sv;
        }

        var clone = transclude($scope);
        angular.element($element[0].firstElementChild).append(clone);
      };
    }
  };
})

.directive('refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher" ng-transclude></div>'
  }
})

})();
