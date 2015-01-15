/**
* @ngdoc directive
* @name ionLoader
* @module ionic
* @restrict E
* @description
*/
IonicModule
.directive('ionLoader', function() {
  return {
    restrict: 'E',
    controller: '$ionicLoader',
    link: function($scope, $element, $attrs, ctrl) {
      ctrl.init();
    }
  };
});
