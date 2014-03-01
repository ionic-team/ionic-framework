angular.module('ionic.ui.navAnimation', [])
.directive('ionNavAnimation', function() {
  return {
    restrict: 'A',
    require: '^?ionNavView',
    link: function($scope, $element, $attrs, navViewCtrl) {
      if (!navViewCtrl) {
        return;
      }
      ionic.on('tap', function() {
        navViewCtrl.setNextAnimation($attrs.ionNavAnimation);
      }, $element[0]);
    }
  };
});
