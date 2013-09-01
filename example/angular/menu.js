angular.module('ionic.menu', [])

.controller('LeftRightMenuController', ['$scope', '$element',
function LeftRightMenuCtrl($scope, $element) {
  var ctrl = ion.controllers.LeftRightMenuViewController;
}])

.directive('ionicLeftRightMenu', function() {
  return {
    restrict: 'EA',
    scope: true,
    transclude: true,
    controller: 'LeftRightMenuController',
    compile: function(elm, attrs, transclude) {
      return function(scope, element, attrs, menuCtrl) {
        console.log('Compile');
      };
    },
    link: function(scope) {
      console.log('link');
    }
  }
})

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

