(function() {
'use strict';

angular.module('ionic.ui.content', [])

/**
 * Panel is a simple 100% width and height, fixed panel. It's meant for content to be
 * added to it, or animated around.
 */
.directive('pane', function() {
  return {
    restrict: 'E',
    compile: function(element, attr) {
      element.addClass('pane');
    }
  }
})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', ['$parse', function($parse) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-content"><div class="scroll"></div></div>',
    transclude: true,
    scope: {
      onRefresh: '&',
      onRefreshOpening: '&',
      refreshComplete: '=',
      scroll: '@'
    },
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var c = $element.eq(0);

        if(attr.padded) {
          c.addClass('padding');
        }

        if(attr.hasHeader) {
          c.addClass('has-header');
        }
        if(attr.hasSubheader) {
          c.addClass('has-subheader');
        }
        if(attr.hasFooter) {
          c.addClass('has-footer');
        }
        if(attr.hasTabs) {
          c.addClass('has-tabs');
        }

        if(attr.refreshComplete) {
          $scope.refreshComplete = function() {
            if($scope.scrollView) {
              $scope.scrollView.doneRefreshing();
              $scope.$parent.$broadcast('scroll.onRefreshComplete');
            }
          };
        }

        // If they want plain overflow scrolling, add that as a class
        if($scope.scroll === "false") {
        } else if(attr.overflowScroll === "true") {
          c.addClass('overflow-scroll');
        } else {
          // Otherwise, supercharge this baby!
          var sv = new ionic.views.Scroll({
            el: $element[0].firstElementChild,
            hasPullToRefresh: (typeof $scope.onRefresh !== 'undefined'),
            onRefresh: function() {
              $scope.onRefresh();
              $scope.$parent.$broadcast('scroll.onRefresh');
            },
            onRefreshOpening: function(amt) {
              $scope.onRefreshOpening({amount: amt});
              $scope.$parent.$broadcast('scroll.onRefreshOpening', amt);
            }
          });
          // Let child scopes access this 
          $scope.scrollView = sv;
        }

        // Pass the parent scope down to the child
        var clone = transclude($scope.$parent);
        angular.element($element[0].firstElementChild).append(clone);
      };
    }
  };
}])

.directive('refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^?content', '^?list'],
    template: '<div class="scroll-refresher"><div class="ionic-refresher-content"><div class="ionic-refresher"></div></div></div>',
    scope: true,
    link: function($scope, $element, $attr, scrollCtrl) {
      var icon = $element[0].querySelector('.ionic-refresher');

      // Scale up the refreshing icon
      var onRefreshOpening = ionic.throttle(function(e, amt) {
        icon.style[ionic.CSS.TRANSFORM] = 'scale(' + Math.min((1 + amt), 2) + ')';
      }, 100);

      $scope.$on('scroll.onRefresh', function(e) {
        icon.style[ionic.CSS.TRANSFORM] = 'scale(2)';
      });

      $scope.$on('scroll.onRefreshOpening', onRefreshOpening);
    }
  }
})

.directive('scroll-refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content"></div></div>'
  }
});


})();
