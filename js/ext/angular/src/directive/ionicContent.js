(function() {
'use strict';

angular.module('ionic.ui.content', ['ionic.ui.service', 'ionic.ui.scroll'])

/**
 * Panel is a simple 100% width and height, fixed panel. It's meant for content to be
 * added to it, or animated around.
 */
.directive('ionPane', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  };
})

/*
 * @ngdoc directive
 * @name ionContent
 *
 * @description
 * The ionContent directive provides an easy to use content area that can be configured to use
 * Ionic's custom Scroll View, or the built in overflow scorlling of the browser.
 *
 * While we recommend using the custom Scroll features in Ionic in most cases, sometimes (for performance reasons) only the browser's native overflow scrolling will suffice, and so we've made it easy to toggle between the Ionic scroll implementation and overflow scrolling.
 *
 * When using the Ionic scroll features, you'll get pull-to-refresh, customizable scroll mechanics (like bounce easing, momentum acceleration, etc.) which aligns Ionic with native SDKs that give you access to scroll behavior. You'll also get events while in a momentum scroll, which -webkit-overflow-scrolling: touch will not, making it of limited use in real applications.
 *
 * Also, we are working on virtual list rendering which will only work when using Ionic's scroll view. That is on the upcoming roadmap.
 *
 * @restrict E
 * @param {boolean=} scroll Whether to allow scrolling of content.  Defaults to true.
 * @param {boolean=} overflow-scroll Whether to use overflow-scrolling instead of Ionic scroll.
 * @param {boolean=} padding Whether to add padding to the content.
 * @param {boolean=} has-header Whether to offset the content for a header bar.
 * @param {boolean=} has-subheader Whether to offset the content for a subheader bar.
 * @param {boolean=} has-footer Whether to offset the content for a footer bar.
 * @param {boolean=} has-bouncing Whether to allow scrolling to bounce past the edges of the content.  Defaults to true on iOS, false on Android.
 * @param {expression=} on-refresh Expression to evaluate on refresh completion.
 * @param {expression=} on-refresh-opening Expression to evaluate on refresh opening.
 * @param {expression=} on-scroll Expression to evaluate when the content is scrolled.
 * @param {expression=} on-scroll-complete Expression to evaluate when a scroll action completes.
 */
.directive('ionContent', [
  '$parse',
  '$timeout',
  '$ionicScrollDelegate',
  '$controller',
  '$ionicBind',
function($parse, $timeout, $ionicScrollDelegate, $controller, $ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    require: '^?ionNavView',
    scope: true,
    template:
    '<div class="scroll-content">' +
      '<div class="scroll"></div>' +
    '</div>',
    compile: function(element, attr, transclude) {
      if(attr.hasHeader == "true") { element.addClass('has-header'); }
      if(attr.hasSubheader == "true") { element.addClass('has-subheader'); }
      if(attr.hasFooter == "true") { element.addClass('has-footer'); }
      if(attr.hasTabs == "true") { element.addClass('has-tabs'); }
      if(attr.padding == "true") { element.find('div').addClass('padding'); }

      return {
        //Prelink <ion-content> so it can compile before other directives compile.
        //Then other directives can require ionicScrollCtrl
        pre: prelink
      };

      function prelink($scope, $element, $attr, navViewCtrl) {
        var clone, sc, scrollView, scrollCtrl,
          scrollContent = angular.element($element[0].querySelector('.scroll'));

        transclude($scope, function(clone) {
          scrollContent.append(clone);
        });

        $ionicBind($scope, $attr, {
          //Use $ to stop onRefresh from recursively calling itself
          $onRefresh: '&onRefresh',
          $onRefreshOpening: '&onRefreshOpening',
          $onScroll: '&onScroll',
          $onScrollComplete: '&onScrollComplete',
          refreshComplete: '=',
          onInfiniteScroll: '&',
          infiniteScrollDistance: '@',
          hasBouncing: '@',
          scroll: '@',
          padding: '@',
          hasScrollX: '@',
          hasScrollY: '@',
          scrollbarX: '@',
          scrollbarY: '@',
          startX: '@',
          startY: '@',
          scrollEventInterval: '@'
        });

        if($scope.scroll === "false") {
          // No scrolling
          return;
        }

        if(attr.overflowScroll === "true") {
          $element.addClass('overflow-scroll');
          return;
        }

        scrollCtrl = $controller('$ionicScroll', {
          $scope: $scope,
          scrollViewOptions: {
            el: $element[0],
            bouncing: $scope.$eval($scope.hasBouncing),
            startX: $scope.$eval($scope.startX) || 0,
            startY: $scope.$eval($scope.startY) || 0,
            scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
            scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
            scrollingX: $scope.$eval($scope.hasScrollX) === true,
            scrollingY: $scope.$eval($scope.hasScrollY) !== false,
            scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 20,
            scrollingComplete: function() {
              $scope.$onScrollComplete({
                scrollTop: this.__scrollTop,
                scrollLeft: this.__scrollLeft
              });
            }
          }
        });

        //Publish scrollView to parent so children can access it
        scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;

        $scope.$on('$viewContentLoaded', function(e, viewHistoryData) {
          viewHistoryData || (viewHistoryData = {});
          var scroll = viewHistoryData.scrollValues;
          if (scroll) {
            $timeout(function() {
              scrollView.scrollTo(+scroll.left || null, +scroll.top || null);
            }, 0);
          }

          //Save scroll onto viewHistoryData when scope is destroyed
          $scope.$on('$destroy', function() {
            viewHistoryData.scrollValues = scrollView.getValues();
          });
        });

        if(attr.refreshComplete) {
          $scope.refreshComplete = function() {
            if($scope.scrollView) {
              scrollCtrl.refresher && scrollCtrl.refresher.classList.remove('active');
              scrollView.finishPullToRefresh();
              $scope.$parent.$broadcast('scroll.onRefreshComplete');
            }
          };
        }

        // Check if this supports infinite scrolling and listen for scroll events
        // to trigger the infinite scrolling
        // TODO(ajoslin): move functionality out of this function and make testable
        var infiniteScroll = $element.find('ion-infinite-scroll');
        var infiniteStarted = false;
        if(infiniteScroll) {
          // Parse infinite scroll distance
          var distance = attr.infiniteScrollDistance || '1%';
          var maxScroll;
          if(distance.indexOf('%')) {
            // It's a multiplier
            maxScroll = function() {
              return scrollView.getScrollMax().top * ( 1 - parseInt(distance, 10) / 100 );
            };
          } else {
            // It's a pixel value
            maxScroll = function() {
              return scrollView.getScrollMax().top - parseInt(distance, 10);
            };
          }
          $element.bind('scroll', function(e) {
            if( scrollView && !infiniteStarted && (scrollView.getValues().top > maxScroll() ) ) {
              infiniteStarted = true;
              infiniteScroll.addClass('active');
              var cb = function() {
                scrollView.resize();
                infiniteStarted = false;
                infiniteScroll.removeClass('active');
              };
              $scope.$apply(angular.bind($scope, $scope.onInfiniteScroll, cb));
            }
          });
        }
      }
    }
  };
}])

.directive('ionRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^?ionContent', '^?ionList'],
    template: '<div class="scroll-refresher"><div class="ionic-refresher-content"><i class="icon ion-arrow-down-c icon-pulling"></i><i class="icon ion-loading-d icon-refreshing"></i></div></div>',
    scope: true
  };
})

.directive('ionScrollRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content" ng-transclude></div></div>'
  };
})

.directive('ionInfiniteScroll', function() {
  return {
    restrict: 'E',
    replace: false,
    template: '<div class="scroll-infinite"><div class="scroll-infinite-content"><i class="icon ion-loading-d icon-refreshing"></i></div></div>'
  };
});

})();
