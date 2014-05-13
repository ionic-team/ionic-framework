angular.module('ionicApp', ['ionic'])

.controller('MainCtrl', function ($scope) {

  $scope.possibleValues = ['One', 'Two', 'Three'];
  $scope.value = $scope.possibleValues[0];

});
