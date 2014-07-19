---
name: simple
component: ionFooterBar
---
angular.module('simple', ['ionic'])
.controller('FooterBarSimpleCtrl', function($scope) {
  $scope.data = {
    isSubfooter: false,
    isShown: true
  };

  $scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push('Item ' + i);
  }
});
