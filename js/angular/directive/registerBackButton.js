IonicModule
.directive('ionRegisterBackButton', ['$ionicPlatform', 'IONIC_BACK_PRIORITY', function ($ionicPlatform, IONIC_BACK_PRIORITY) {
  return {
    restrict: 'A',
    link: function ($scope, $element) {
      var deregister = $ionicPlatform.registerBackButtonAction(function () {
        $element.click();
      }, IONIC_BACK_PRIORITY.registerBackButtonDirective);

      $scope.$on('$destroy', function() {
        deregister();
      });
    }
  };
}]);
