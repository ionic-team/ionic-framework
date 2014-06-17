---
name: simple
component: ionHeaderBar
---
angular.module('simple', ['ionic'])
.controller('HeaderBarSimpleCtrl', function($scope) {
  $scope.data = {
    isSubheader: false,
    isShown: true
  };
  $scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push('Item ' + i);
  }
});
