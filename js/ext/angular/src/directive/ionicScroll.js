(function() {
'use strict';

angular.module('ionic.ui.scroll', [])

/**
 * @ngdoc directive
 * @name ionScroll
 * @module ionic
 * @delegate ionic.service:$ionicScrollDelegate
 * @restrict E
 *
 * @description
 * Creates a scrollable container for all content inside.
 *
 * @param {string=} delegate-handle The handle used to identify this scrollView
 * with {@link ionic.service:$ionicScrollDelegate}.
 * @param {string=} direction Which way to scroll. 'x' or 'y'. Default 'y'.
 * @param {boolean=} paging Whether to scroll with paging.
 * @param {expression=} on-refresh Called on pull-to-refresh, triggered by an {@link ionic.directive:ionRefresher}.
 * @param {expression=} on-scroll Called whenever the user scrolls.
 * @param {boolean=} scrollbar-x Whether to show the horizontal scrollbar. Default false.
 * @param {boolean=} scrollbar-y Whether to show the vertical scrollbar. Default true.
 */
.directive('ionScroll', [
  '$timeout',
  '$controller',
  '$ionicBind',
function($timeout, $controller, $ionicBind) {
  return {
    restrict: 'E',
    scope: true,
    controller: function() {},
    compile: function(element, attr) {
      element.addClass('scroll-view');

      //We cannot transclude here because it breaks element.data() inheritance on compile
      var innerElement = angular.element('<div class="scroll"></div>');
      innerElement.append(element.contents());
      element.append(innerElement);

      return { pre: prelink };
      function prelink($scope, $element, $attr) {
        var scrollView, scrollCtrl;

        $ionicBind($scope, $attr, {
          direction: '@',
          paging: '@',
          $onScroll: '&onScroll',
          scroll: '@',
          scrollbarX: '@',
          scrollbarY: '@',
        });

        if (angular.isDefined($attr.padding)) {
          $scope.$watch($attr.padding, function(newVal) {
            innerElement.toggleClass('padding', !!newVal);
          });
        }
        if($scope.$eval($scope.paging) === true) {
          innerElement.addClass('scroll-paging');
        }

        if(!$scope.direction) { $scope.direction = 'y'; }
        var isPaging = $scope.$eval($scope.paging) === true;

        var scrollViewOptions= {
          el: $element[0],
          delegateHandle: $attr.delegateHandle,
          paging: isPaging,
          scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
          scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
          scrollingX: $scope.direction.indexOf('x') >= 0,
          scrollingY: $scope.direction.indexOf('y') >= 0
        };
        if (isPaging) {
          scrollViewOptions.speedMultiplier = 0.8;
          scrollViewOptions.bouncing = false;
        }

        scrollCtrl = $controller('$ionicScroll', {
          $scope: $scope,
          scrollViewOptions: scrollViewOptions
        });
        scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;
      }
    }
  };
}]);

})();
