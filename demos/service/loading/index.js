---
name: complete
component: $ionicLoading
---
angular.module('complete', ['ionic'])
.controller('LoadingCtrl', function($scope, $ionicLoading) {
  $scope.loadingOptions = {
    duration: 1000,
    delay: 0,
    template: '<i class="icon ion-loading-c"></i>\n<br/>\nLoading...',
    noBackdrop: false
  };
  $scope.showLoading = function() {
    $ionicLoading.show($scope.loadingOptions);
  };
});
