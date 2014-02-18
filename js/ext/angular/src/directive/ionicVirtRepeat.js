(function() {
'use strict';

angular.module('ionic.ui.virtRepeat', [])

.directive('ionVirtRepeat', function() {
  return {
    require: ['?ngModel', '^virtualList'],
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, ctrls) {
        var virtualList = ctrls[1];

        virtualList.listView.renderViewport = function(high, low, start, end) {
        };
      };
    }
  };
});
})(ionic);
