angular.module('ionic.menu', [])

.controller('LeftRightMenuController', ['$scope', '$element',
function LeftRightMenuCtrl($scope, $element) {
  var ctrl = ion.controllers.LeftRightMenuViewController;

  $scope.controllerInitData = {};

  $scope.initIonicController = function() {
    $scope._ionicController = new ctrl($scope.controllerInitData);
  };
}])

.directive('ionicLeftRightMenu', function() {
  return {
    restrict: 'EA',
    controller: 'LeftRightMenuController',
    link: function($scope, element, attributes) {
      $scope
      console.log('link', $scope);
    }
  }
})

/*
.directive('ionicMenu', function() {
  return {
    restrict: 'EA',
    controller: '',
    compile: function(elm, attrs, transclude) {
      return function(scope, element, attrs, menuCtrl) {
        console.log('Compile');
      };
    },
    link: function(scope) {
      console.log('link');
    }
  }
});

*/
