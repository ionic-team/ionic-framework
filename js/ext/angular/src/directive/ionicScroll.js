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
      paging: '@',
      onRefresh: '&',
      onScroll: '&',
      refreshComplete: '=',
      scroll: '@',
      scrollbarX: '@',
      scrollbarY: '@',
    },

    controller: function() {},

    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var clone, sv, sc = document.createElement('div');

        // Create the internal scroll div
        sc.className = 'scroll';
        if(attr.padding == "true") {
          sc.classList.add('padding');
        }
        if($scope.$eval($scope.paging) === true) {
          sc.classList.add('scroll-paging');
        }
        $element.append(sc);

        // Pass the parent scope down to the child
        clone = transclude($scope.$parent);
        angular.element($element[0].firstElementChild).append(clone);

        // Get refresher size
        var refresher = $element[0].querySelector('.scroll-refresher');
        var refresherHeight = refresher && refresher.clientHeight || 0;

        if(!$scope.direction) { $scope.direction = 'y'; }
        var hasScrollingX = $scope.direction.indexOf('x') >= 0;
        var hasScrollingY = $scope.direction.indexOf('y') >= 0;

        $timeout(function() {
          var options = {
            el: $element[0],
            paging: $scope.$eval($scope.paging) === true,
            scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
            scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
            scrollingX: hasScrollingX,
            scrollingY: hasScrollingY
          };

          if(options.paging) {
            options.speedMultiplier = 0.8;
            options.bouncing = false;
          }

          sv = new ionic.views.Scroll(options);

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

          $scope.$parent.$on('scroll.resize', function(e) {
            // Run the resize after this digest
            $timeout(function() {
              sv && sv.resize();
            });
          });

          $scope.$parent.$on('scroll.refreshComplete', function(e) {
            sv && sv.finishPullToRefresh();
          });
          
          // Let child scopes access this 
          $scope.$parent.scrollView = sv;
        });
      };
    }
  };
}]);

})();
