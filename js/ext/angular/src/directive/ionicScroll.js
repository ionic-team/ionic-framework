(function() {
'use strict';

angular.module('ionic.ui.scroll', [])

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
      refreshComplete: '=',
      scroll: '@',
      scrollbarX: '@',
      scrollbarY: '@',
    },

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
