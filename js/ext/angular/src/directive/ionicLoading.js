(function() {
'use strict';

angular.module('ionic.ui.loading', [])

.directive('loading', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    link: function($scope, $element){
      $scope.$on('$destroy', function() {
        $element.remove();
      });
      $element.addClass($scope.animation || '');
    },
    template: '<div class="loading-backdrop" ng-class="{enabled: showBackdrop}">' + 
                '<div class="loading" ng-transclude>' +
                '</div>' +
              '</div>'
  };
});

})();
