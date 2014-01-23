(function() {
'use strict';

angular.module('ionic.ui.service.sideMenuDelegate', [])

.factory('$ionicSideMenuDelegate', ['$rootScope', '$timeout', '$q', function($rootScope, $timeout, $q) {
  return {
    getSideMenuController: function($scope) {
      return $scope.sideMenuController;
    },
    close: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.close();
      }
    },
    toggleLeft: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.toggleLeft();
      }
    },
    toggleRight: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.toggleRight();
      }
    },
    openLeft: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.openPercentage(100);
      }
    },
    openRight: function($scope) {
      if($scope.sideMenuController) {
        $scope.sideMenuController.openPercentage(-100);
      }
    }
  };
}]);

})();
