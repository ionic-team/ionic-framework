(function() {
'use strict';

angular.module('ionic.ui.scroll', [])

/**
 * @ngdoc directive
 * @name ionScroll
 * @module ionic
 * @controller ionicScroll as $scope.$ionicScrollController
 * @restrict E
 *
 * @description
 * Creates a scrollable container for all content inside.
 *
 * @param {string=} controller-bind The scope variable to bind this element's scrollView's
 * {@link ionic.controller:ionicScroll ionicScroll controller} to.
 * Default: $scope.$ionicScrollController.
 * @param {string=} direction Which way to scroll. 'x' or 'y'. Default 'y'.
 * @param {boolean=} paging Whether to scroll with paging.
 * @param {expression=} on-refresh Called on pull-to-refresh, triggered by an {@link ionic.directive:ionRefresher}.
 * @param {expression=} on-scroll Called whenever the user scrolls.
 * @param {boolean=} scrollbar-x Whether to show the horizontal scrollbar. Default false.
 * @param {boolean=} scrollbar-x Whether to show the vertical scrollbar. Default true.
 */
.directive('ionScroll', ['$parse', '$timeout', '$controller', function($parse, $timeout, $controller) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-view"><div class="scroll" ng-transclude></div></div>',
    transclude: true,
    scope: {
      direction: '@',
      paging: '@',
      onRefresh: '&',
      onScroll: '&',
      scroll: '@',
      scrollbarX: '@',
      scrollbarY: '@',
    },
    priority: 501,

    controller: function() {},

    compile: function(element, attr, transclude) {

      return {
        //Prelink <ion-scroll> so it can compile before other directives compile.
        //Then other directives can require ionicScrollCtrl
        pre: prelink
      };

      function prelink($scope, $element, $attr) {
        var scrollView, scrollCtrl,
          sc = $element[0].children[0];

        if(attr.padding == "true") {
          sc.classList.add('padding');
        }
        if($scope.$eval($scope.paging) === true) {
          sc.classList.add('scroll-paging');
        }

        if(!$scope.direction) { $scope.direction = 'y'; }
        var isPaging = $scope.$eval($scope.paging) === true;

        var scrollViewOptions= {
          el: $element[0],
          controllerBind: $attr.controllerBind,
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
