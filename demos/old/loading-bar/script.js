angular.module('ionicApp', ['ionic'])

.controller('MainCtrl', ['$scope',
  function ($scope) {
    $scope.data = {
      isLoading: false
    };
}]);