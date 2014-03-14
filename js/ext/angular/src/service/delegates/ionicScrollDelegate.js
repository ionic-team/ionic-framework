(function() {
'use strict';

angular.module('ionic.ui.service.scrollDelegate', [])

/**
 * @ngdoc service
 * @name $ionicScrollDelegate
 * @module ionic
 * @group page layout
 * @description
 * Allows you to have some control over a scrollable area (created by an
 * {@link ionic.directive:ionContent} or {@link ionic.directive:ionScroll}
 * directive).
 *
 * Inject it into a controller, and its methods will send messages to the nearest scrollView and all of its children.
 *
 * @usage
 * ```html
 * <ion-content ng-controller="MyController">
 *   <button class="button" ng-click="scrollToTop()">
 *     Scroll To Top
 *   </button>
 * </ion-content>
 * ```
 * ```js
 * function MyController($scope, $ionicScrollDelegate) {
 *   $scope.scrollToTop = function() {
 *     $ionicScrollDelegate.scrollTop();
 *   };
 * }
 * ```
 */
.factory('$ionicScrollDelegate', ['$rootScope', '$timeout', '$q', '$anchorScroll', '$location', '$document', function($rootScope, $timeout, $q, $anchorScroll, $location, $document) {
  return {
    /**
     * @ngdoc method
     * @name $ionicScrollDelegate#scrollTop
     * @param {boolean=} shouldAnimate Whether the scroll should animate.
     */
    scrollTop: function(animate) {
      $rootScope.$broadcast('scroll.scrollTop', animate);
    },
    /**
     * @ngdoc method
     * @name $ionicScrollDelegate#scrollBottom
     * @param {boolean=} shouldAnimate Whether the scroll should animate.
     */
    scrollBottom: function(animate) {
      $rootScope.$broadcast('scroll.scrollBottom', animate);
    },
    /**
     * @ngdoc method
     * @name $ionicScrollDelegate#scroll
     * @param {number} left The x-value to scroll to.
     * @param {number} top The y-value to scroll to.
     * @param {boolean=} shouldAnimate Whether the scroll should animate.
     */
    scrollTo: function(left, top, animate) {
      $rootScope.$broadcast('scroll.scrollTo', left, top, animate);
    },
    /**
     * @ngdoc method
     * @name $ionicScrollDelegate#anchorScroll
     * @description Tell the scrollView to scroll to the element with an id
     * matching window.location.hash.
     *
     * If no matching element is found, it will scroll to top.
     *
     * @param {boolean=} shouldAnimate Whether the scroll should animate.
     */
    anchorScroll: function(animate) {
      $rootScope.$broadcast('scroll.anchorScroll', animate);
    },
    /**
     * @ngdoc method
     * @name $ionicScrollDelegate#resize
     * @description Tell the scrollView to recalculate the size of its container.
     */
    resize: function() {
      $rootScope.$broadcast('scroll.resize');
    },
    /**
     * @private
     */
    tapScrollToTop: function(element, animate) {
      var _this = this;
      if (!angular.isDefined(animate)) {
        animate = true;
      }

      ionic.on('tap', function(e) {
        var target = e.target;
        //Don't scroll to top for a button click
        if (ionic.DomUtil.getParentOrSelfWithClass(target, 'button')) {
          return;
        }

        var el = element[0];
        var bounds = el.getBoundingClientRect();

        if(ionic.DomUtil.rectContains(e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, bounds.left, bounds.top, bounds.left + bounds.width, bounds.top + 20)) {
          _this.scrollTop(animate);
        }
      }, element[0]);
    },

    finishRefreshing: function($scope) {
      $scope.$broadcast('scroll.refreshComplete');
    },

    /**
     * @private
     * Attempt to get the current scroll view in scope (if any)
     *
     * Note: will not work in an isolated scope context.
     */
    getScrollView: function($scope) {
      return $scope.scrollView;
    },

    /**
     * @private
     * Register a scope and scroll view for scroll event handling.
     * $scope {Scope} the scope to register and listen for events
     */
    register: function($scope, $element, scrollView) {

      var scrollEl = $element[0];

      function scrollViewResize() {
        // Run the resize after this digest
        return $timeout(function() {
          scrollView.resize();
        });
      }

      $element.on('scroll', function(e) {
        var detail = (e.originalEvent || e).detail || {};

        $scope.$onScroll && $scope.$onScroll({
          event: e,
          scrollTop: detail.scrollTop || 0,
          scrollLeft: detail.scrollLeft || 0
        });

      });

      $scope.$parent.$on('scroll.resize', scrollViewResize);

      // Called to stop refreshing on the scroll view
      $scope.$parent.$on('scroll.refreshComplete', function(e) {
        scrollView.finishPullToRefresh();
      });

      $scope.$parent.$on('scroll.anchorScroll', function(e, animate) {
        scrollViewResize().then(function() {
          var hash = $location.hash();
          var elm;
          if (hash && (elm = document.getElementById(hash)) ) {
            var scroll = ionic.DomUtil.getPositionInParent(elm, scrollEl);
            scrollView.scrollTo(scroll.left, scroll.top, !!animate);
          } else {
            scrollView.scrollTo(0,0, !!animate);
          }
        });
      });

      $scope.$parent.$on('scroll.scrollTo', function(e, left, top, animate) {
        scrollViewResize().then(function() {
          scrollView.scrollTo(left, top, !!animate);
        });
      });
      $scope.$parent.$on('scroll.scrollTop', function(e, animate) {
        scrollViewResize().then(function() {
          scrollView.scrollTo(0, 0, !!animate);
        });
      });
      $scope.$parent.$on('scroll.scrollBottom', function(e, animate) {
        scrollViewResize().then(function() {
          var sv = scrollView;
          if (sv) {
            var max = sv.getScrollMax();
            sv.scrollTo(max.left, max.top, !!animate);
          }
        });
      });
    }
  };
}]);

})(ionic);
