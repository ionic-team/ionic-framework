angular.module('ionicApp', ['ionic'])

.controller('MyCtrl', function($scope) {
  $scope.myTitle = 'Template';

  $scope.doSomething = function() {
    $scope.myTitle = $scope.myTitle + ' something';
  };
});