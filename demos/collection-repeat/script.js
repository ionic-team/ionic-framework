function MainCtrl($scope, $ionicScrollDelegate, $timeout) {
  $scope.items = [];
  for (var i = 0; i < 5000; i++) {
    $scope.items.push('item '+i);
  }

  $scope.getItemHeight = function(index) {
    return 52 + 5 * (index % 5);
  };

  $scope.onRefresh = function() {
    $timeout(function() {
      $scope.items.unshift(-$scope.items.length);
      $scope.items.unshift(-$scope.items.length);
      $scope.items.unshift(-$scope.items.length);
      $scope.items.unshift(-$scope.items.length);
      $scope.items.unshift(-$scope.items.length);
      $scope.$broadcast('scroll.refreshComplete');
    }, 1500);
  };

  $scope.scrollBottom = function(animate) {
    $ionicScrollDelegate.scrollBottom(animate);
  };
}
