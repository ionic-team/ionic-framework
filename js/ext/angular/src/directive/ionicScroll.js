(function() {
'use strict';

angular.module('ionic.ui.scroll', [])

.directive('scroll', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-view"></div>',
    transclude: true,
    scope: {
      direction: '@',
      onRefresh: '&',
      onScroll: '&',
      refreshComplete: '=',
      scroll: '@',
    },

    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var clone, sv, sc = document.createElement('div');

        sc.className = 'scroll';
        if(attr.padding == "true") {
          sc.className += ' padding';
          addedPadding = true;
        }
        $element.append(sc);

        // Pass the parent scope down to the child
        clone = transclude($scope.$parent);
        angular.element($element[0].firstElementChild).append(clone);

        var refresher = $element[0].querySelector('.scroll-refresher');
        var refresherHeight = refresher && refresher.clientHeight || 0;

        if(attr.refreshComplete) {
          $scope.refreshComplete = function() {
            if($scope.scrollView) {
              refresher && refresher.classList.remove('active');
              $scope.scrollView.finishPullToRefresh();
              $scope.$parent.$broadcast('scroll.onRefreshComplete');
            }
          };
        }


        // Otherwise, supercharge this baby!
        // Add timeout to let content render so Scroller.resize grabs the right content height
        $timeout(function() { 
          var hasScrollingX = $scope.direction.indexOf('x') >= 0;
          var hasScrollingY = $scope.direction.indexOf('y') >= 0;

          sv = new ionic.views.Scroll({
            el: $element[0],
            scrollingX: hasScrollingX,
            scrollingY: hasScrollingY
          });

          // Activate pull-to-refresh
          if(refresher) {
            sv.activatePullToRefresh(refresherHeight, function() {
              refresher.classList.add('active');
            }, function() {
              refresher.classList.remove('refreshing');
              refresher.classList.remove('active');
            }, function() {
              refresher.classList.add('refreshing');
              $scope.onRefresh();
              $scope.$parent.$broadcast('scroll.onRefresh');
            });
          }

          $element.bind('scroll', function(e) {
            $scope.onScroll({
              event: e,
              scrollTop: e.detail ? e.detail.scrollTop : e.originalEvent ? e.originalEvent.detail.scrollTop : 0,
              scrollLeft: e.detail ? e.detail.scrollLeft: e.originalEvent ? e.originalEvent.detail.scrollLeft : 0
            });
          });

          $scope.$parent.$on('scroll.refreshComplete', function(e) {
            sv && sv.finishPullToRefresh();
          });
          
          // Let child scopes access this 
          $scope.$parent.scrollView = sv;
        }, 500);
      };
    }
  };
}]);

})();
