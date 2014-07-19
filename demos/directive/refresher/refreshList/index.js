---
name: refreshList
component: ionRefresher
---
angular.module('refreshList', ['ionic'])
.controller('RefresherCtrl', function($scope, $timeout) {
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.doRefresh = function() {
    $timeout(function() {
      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };
});
