---
name: reorderDelete
component: ionList
---
angular.module('reorderDelete', ['ionic'])
.controller('ListCtrl', function($scope, $ionicPopup) {
  $scope.data = {
    showReorder: false,
    showDelete: false
  };

  $scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push(i);
  }

  $scope.toggleDelete = function() {
    $scope.data.showReorder = false;
    $scope.data.showDelete = !$scope.data.showDelete;
  };
  $scope.toggleReorder = function() {
    $scope.data.showDelete = false;
    $scope.data.showReorder = !$scope.data.showReorder;
  };

  $scope.share = function(item) {
    alert('Sharing ' + item);
  };
  $scope.edit = function(item) {
    alert('Editing ' + item);
  };

  $scope.reorderItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1)
    $scope.items.splice(toIndex, 0, item)
  };
});
