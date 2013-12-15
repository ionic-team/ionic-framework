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
.directive('content', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-content"></div>',
    transclude: true,
    scope: {
      onRefresh: '&',
      onRefreshOpening: '&',
      onScroll: '&',
      onScrollComplete: '&',
      refreshComplete: '=',
      scroll: '@',
      hasScrollX: '@',
      hasScrollY: '@',
      scrollbarX: '@',
      scrollbarY: '@',
      scrollEventInterval: '@'
    },
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var clone, sc, sv,
          addedPadding = false,
          c = $element.eq(0);

        if(attr.hasHeader == "true") { c.addClass('has-header'); }
        if(attr.hasSubheader == "true") { c.addClass('has-subheader'); }
        if(attr.hasFooter == "true") { c.addClass('has-footer'); }
        if(attr.hasTabs == "true") { c.addClass('has-tabs'); }

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
          $timeout(function() {
            sv = new ionic.views.Scroll({
              el: $element[0],
              scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
              scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
              scrollingX: $scope.$eval($scope.hasScrollX) === true,
              scrollingY: $scope.$eval($scope.hasScrollY) !== false,
              scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 20,
              scrollingComplete: function() {
                $scope.onScrollComplete({
                  scrollTop: this.__scrollTop,
                  scrollLeft: this.__scrollLeft
                });
              }
            });

            // Activate pull-to-refresh
            if(refresher) {
              sv.activatePullToRefresh(50, function() {
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
    template: '<div class="scroll-refresher"><div class="ionic-refresher-content"><i class="icon ion-arrow-down-c icon-pulling"></i><i class="icon ion-loading-d icon-refreshing"></i></div></div>',
    scope: true
  };
})

.directive('scrollRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content" ng-transclude></div></div>'
  };
});


})();
