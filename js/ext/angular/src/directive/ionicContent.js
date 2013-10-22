(function() {
'use strict';

angular.module('ionic.ui.content', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="content"></div>',
    transclude: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var c = $element.eq(0);


        if(attr.hasHeader) {
          c.addClass('has-header');
        }
        if(attr.hasFooter) {
          c.addClass('has-footer');
        }
        if(attr.hasTabs) {
          c.addClass('has-tabs');
        }
        var e = transclude($scope);
        console.log(e);
      };
    }
  };
});
})();
