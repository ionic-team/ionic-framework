(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('ionCheckbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChecked: '=?',
      ngChange: '&'
    },
    transclude: true,

    template: '<div class="item item-checkbox disable-pointer-events">' +
                '<label class="checkbox enable-pointer-events">' +
                  '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' +
                '</label>' +
                '<div class="item-content" ng-transclude></div>' +
              '</div>',

    compile: function(element, attr) {
      var input = element.find('input');
      if(attr.name) input.attr('name', attr.name);
      if(attr.ngChecked) input.attr('ng-checked', 'ngChecked');
      if(attr.ngTrueValue) input.attr('ng-true-value', attr.ngTrueValue);
      if(attr.ngFalseValue) input.attr('ng-false-value', attr.ngFalseValue);
    }

  };
});

})();
