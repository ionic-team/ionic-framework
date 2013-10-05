angular.module('ionic.ui.content', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: false,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        $element.addClass('content');

        if(attr.hasHeader) {
          $element.addClass('has-header');
        }
        if(attr.hasTabs) {
          $element.addClass('has-tabs');
        }
      }
    }
  }
})
