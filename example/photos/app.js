angular.module('ionic.photos', [])

.controller('PhotosCtrl', function($scope) {
  $scope.photos = [];
  for(var i = 0; i < 100; i++) {
    $scope.photos.push({});
  }
})
