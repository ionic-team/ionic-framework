
/**
 * @ngdoc directive
 * @name ionPane
 * @module ionic
 * @restrict E
 *
 * @description A simple container that fits content, with no side effects.  Adds the 'pane' class to the element.
 */
IonicModule
.directive('ionPane', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.addClass('pane');
    }
  };
});
