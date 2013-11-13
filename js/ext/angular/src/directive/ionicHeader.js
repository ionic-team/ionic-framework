(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate'])


.directive('headerBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<header class="bar bar-header" ng-transclude></header>',
    scope: {
      type: '@',
      alignTitle: '@',
    },
    link: function($scope, $element, $attr) {
      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });

      $element.addClass($scope.type);

      $scope.headerBarView = hb;

      $scope.$on('$destroy', function() {
        //
      });
    }
  };
});

})(ionic);
