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
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  };
})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', ['$parse', function($parse) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-content"></div>',
    transclude: true,
    scope: {
      onRefresh: '&',
      onRefreshOpening: '&',
      refreshComplete: '=',
      scroll: '@'
    },
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var 
        c = $element.eq(0),
        clone,
        sc, 
        sv,
        addedPadding = false;

        if(attr.hasHeader == "true") {
          c.addClass('has-header');
        }
        if(attr.hasSubheader == "true") {
          c.addClass('has-subheader');
        }
        if(attr.hasFooter == "true") {
          c.addClass('has-footer');
        }
        if(attr.hasTabs == "true") {
          c.addClass('has-tabs');
        }

        if(attr.refreshComplete) {
          $scope.refreshComplete = function() {
            if($scope.scrollView) {
              //$scope.scrollView.doneRefreshing();
              $scope.$parent.$broadcast('scroll.onRefreshComplete');
            }
          };
        }

        // If they want plain overflow scrolling, add that as a class
        if($scope.scroll === "false") {
          clone = transclude($scope.$parent);
          $element.append(clone);
        } else if(attr.overflowScroll === "true") {
          c.addClass('overflow-scroll');
          clone = transclude($scope.$parent);
          $element.append(clone);
        } else {
          sc = document.createElement('div');
          sc.className = 'scroll';
          if(attr.padding == "true") {
            sc.className += ' padding';
            addedPadding = true;
          }
          $element.append(sc);
          // Otherwise, supercharge this baby!
          sv = new ionic.views.Scroller({
            el: $element[0]
          });
          /*
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
          */
          // Let child scopes access this 
          $scope.$parent.scrollView = sv;

          // Pass the parent scope down to the child
          clone = transclude($scope.$parent);
          angular.element($element[0].firstElementChild).append(clone);
        }

        // if padding attribute is true, then add padding if it wasn't added to the .scroll
        if(attr.padding == "true" && !addedPadding) {
          c.addClass('padding');
        }

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
  };
})

.directive('scroll-refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content"></div></div>'
  };
});


})();
