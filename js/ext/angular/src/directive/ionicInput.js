(function(ionic) {
'use strict';

angular.module('ionic.ui.input', [])

// The radio button is a radio powered element with only
// one possible selection in a set of options.
.directive('inputClear', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      // Create wrapper
      var wrapper = angular.element('<div class="input-clear-wrapper"></div>');
      // Create x
      var x = angular.element('<i class="icon ion-close-circled ng-hide"></i>');

      scope.$watch(attr.ngModel, function(nv, ov) {
        x[nv ? 'removeClass' : 'addClass']('ng-hide');
      });

      // Modify DOM structure
      element.after(wrapper);
      wrapper.append(element);
      wrapper.append(x);

      x.bind('click', function() {
        // TODO Isn't there a better way than to go through the next 3 steps manually?
        ngModel.$setViewValue(''); // doesn't trigger a digest
        scope.$digest();
        ngModel.$render();
      });
    }
  };
});
})(window.ionic);
