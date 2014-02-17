(function() {
'use strict';

angular.module('ionic.ui.service.scrollDelegate', [])

.factory('$ionicScrollDelegate', ['$rootScope', '$timeout', '$q', '$anchorScroll', '$location', '$document', function($rootScope, $timeout, $q, $anchorScroll, $location, $document) {
  return {
    /**
     * Trigger a scroll-to-top event on child scrollers.
     */
    scrollTop: function(animate) {
      $rootScope.$broadcast('scroll.scrollTop', animate);
    },
    scrollBottom: function(animate) {
      $rootScope.$broadcast('scroll.scrollBottom', animate);
    },
    scrollTo: function(left, top, animate) {
      $rootScope.$broadcast('scroll.scrollTo', left, top, animate);
    },
    resize: function() {
      $rootScope.$broadcast('scroll.resize');
    },
    anchorScroll: function(animate) {
      $rootScope.$broadcast('scroll.anchorScroll', animate);
    },
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
     * Attempt to get the current scroll view in scope (if any)
     *
     * Note: will not work in an isolated scope context.
     */
    getScrollView: function($scope) {
      return $scope.scrollView;
    },

    /**
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

      $element.bind('scroll', function(e) {
        $scope.onScroll && $scope.onScroll({
          event: e,
          scrollTop: e.detail ? e.detail.scrollTop : e.originalEvent ? e.originalEvent.detail.scrollTop : 0,
          scrollLeft: e.detail ? e.detail.scrollLeft: e.originalEvent ? e.originalEvent.detail.scrollLeft : 0
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
