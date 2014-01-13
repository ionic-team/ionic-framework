(function() {
'use strict';

angular.module('ionic.ui.service.slideBoxDelegate', [])

.factory('$ionicSlideBoxDelegate', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    /**
     * Trigger a slidebox to update and resize itself
     */
    update: function(animate) {
      $rootScope.$broadcast('slideBox.update');
    },

    register: function($scope, $element) {
      $scope.$parent.$on('slideBox.update', function(e) {
        if(e.defaultPrevented) {
          return;
        }
        $timeout(function() {
          $scope.$parent.slideBox.setup();
        });
        e.preventDefault();
      });
    }
  };
}]);

})(ionic);
