(function() {
'use strict';

angular.module('ionic.ui.content', ['ionic.ui.service', 'ionic.ui.scroll'])

/**
 * Panel is a simple 100% width and height, fixed panel. It's meant for content to be
 * added to it, or animated around.
 */
/**
 * @ngdoc directive
 * @name ionPane
 * @module ionic
 * @restrict E
 *
 * @description A simple container that fits content, with no side effects.  Adds the 'pane' class to the element.
 */
.directive('ionPane', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  };
})

/**
 * @ngdoc directive
 * @name ionContent
 * @module ionic
 *
 * @description
 * The ionContent directive provides an easy to use content area that can be configured to use
 * Ionic's custom Scroll View, or the built in overflow scorlling of the browser.
 *
 * While we recommend using the custom Scroll features in Ionic in most cases, sometimes (for performance reasons) only the browser's native overflow scrolling will suffice, and so we've made it easy to toggle between the Ionic scroll implementation and overflow scrolling.
 *
 * You can implement pull-to-refresh with the {@link ionic.directive:ionRefresher} directive, and infinite scrolling with the {@link ionic.directive:ionInfiniteScroll} directive.
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

        $ionicBind($scope, $attr, {
          //Use $ to stop onRefresh from recursively calling itself
          //DEPRECATED, use <ion-infinite-scroll on-infinite-scroll="">
          $onRefresh: '&onRefresh',
          $onRefreshOpening: '&onRefreshOpening',
          $onScroll: '&onScroll',
          $onScrollComplete: '&onScrollComplete',
          //DEPRECATED, use <ion-infinite-scroll on-infinite-scroll="">
          $onInfiniteScroll: '&onInfiniteScroll',
          refreshComplete: '=',
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

        if ($scope.scroll === "false") {
          //do nothing
        } else if(attr.overflowScroll === "true") {
          $element.addClass('overflow-scroll');
        } else {

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

        }

        transclude($scope, function(clone) {
          if (scrollCtrl) {
            clone.data('$$ionicScrollController', scrollCtrl);
          }
          scrollContent.append(clone);
        });

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

/**
 * @ngdoc directive
 * @name ionInfiniteScroll
 * @module ionic
 * @parent ionContent, ionScroll
 * @restrict E
 *
 * @description
 * The ionInfiniteScroll directive allows you to call a function whenever
 * the user gets to the bottom of the page or near the bottom of the page.
 *
 * The expression you pass in for `on-infinite` is called when the user scrolls
 * greater than `distance` away from the bottom of the content.
 *
 * @param {expression} on-infinite What to call when the scroller reaches the
 * bottom.
 * @param {string=} distance The distance from the bottom that the scroll must
 * reach to trigger the on-infinite expression. Default 1%.
 *
 * @usage
 * ```html
 * <ion-content ng-controller="MyController">
 *   <ion-infinite-scroll
 *     on-infinite="loadMore()"
 *     distance="1%">
 *   </ion-infinite-scroll>
 * </ion-content>
 * ```
 * ```js
 * function MyController($scope, $http) {
 *   $scope.items = [];
 *   $scope.loadMore = function() {
 *     $http.get('/more-items').success(function(items) {
 *       useItems(items);
 *       $scope.$broadcast('scroll.infiniteScrollComplete');
 *     });
 *   };
 * }
 * ```
 *
 * An easy to way to stop infinite scroll once there is no more data to load
 * is to use angular's `ng-if` directive:
 *
 * ```html
 * <ion-infinite-scroll
 *   ng-if="moreDataCanBeLoaded()"
 *   on-infinite="loadMoreData()">
 * </ion-infinite-scroll>
 * ```
 */
.directive('ionInfiniteScroll', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    require: ['^$ionicScroll', 'ionInfiniteScroll'],
    template:
      '<div class="scroll-infinite">' +
        '<div class="scroll-infinite-content">' +
          '<i class="icon ion-loading-d icon-refreshing"></i>' +
        '</div>' +
      '</div>',
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      this.isLoading = false;
      this.scrollView = null; //given by link function
      this.getMaxScroll = function() {
        var dist = $attrs.distance ||
          //deprecated: allow infiniteScrollDistance from ionContent
          $scope.infiniteScrollDistance ||
          '1%';
        return dist.indexOf('%') > -1 ?
          this.scrollView.getScrollMax().top * (1 - parseInt(dist,10) / 100) :
          this.scrollView.getScrollMax().top - parseInt(dist, 10);
      };
    }],
    link: function($scope, $element, $attrs, ctrls) {
      var scrollCtrl = ctrls[0];
      var infiniteScrollCtrl = ctrls[1];
      var scrollView = infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;

      $scope.$on('scroll.infiniteScrollComplete', function() {
        $element[0].classList.remove('active');
        $timeout(function() {
          scrollView.resize();
        }, 0, false);
        infiniteScrollCtrl.isLoading = false;
      });

      scrollCtrl.$element.on('scroll', ionic.animationFrameThrottle(function() {
        if (!infiniteScrollCtrl.isLoading &&
            scrollView.getValues().top >= infiniteScrollCtrl.getMaxScroll()) {
          $element[0].classList.add('active');
          infiniteScrollCtrl.isLoading = true;

          //deprecated: allow $onInfiniteScroll from parent
          $scope.$apply($attrs.onInfinite || $scope.$onInfiniteScroll);
        }
      }));
    }
  };
}]);

})();
