---
name: chooseOne
component: ionRadio
---
angular.module('chooseOne', ['ionic'])
.controller('ChooseOneCtrl', function($scope) {
  $scope.choice = 'two';
});
