---
name: forever
component: ionInfiniteScroll
---
angular.module('forever', ['ionic'])
.controller('ForeverCtrl', function($scope, $timeout) {
  $scope.items = [];
  for (var i = 0; i < 20; i++) {
    $scope.items.push(i);
  }

  //Load more after 1 second delay
  $scope.loadMoreItems = function() {
     var i = $scope.items.length;
     var j = $scope.items.length + 5;
     for (; i < j; i++) {
       $scope.items.push('Item ' + i);
     }
     $scope.$broadcast('scroll.infiniteScrollComplete');
  };
});
