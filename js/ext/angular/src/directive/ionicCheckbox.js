(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])

/**
 * @ngdoc directive
 * @name ionCheckbox
 * @module ionic
 * @restrict E
 * @codepen hqcju
 * @description
 * The checkbox is no different than the HTML checkbox input, except it's styled differently.
 *
 * The checkbox behaves like any [AngularJS checkbox](http://docs.angularjs.org/api/ng/input/input[checkbox]).
 *
 * @usage
 * ```html
 * <ion-checkbox ng-model="isChecked">Checkbox Label</ion-checkbox>
 * ```
 * To enable touching anywhere on the bar add the following css to your project
 * ```css
 * .item.item-checkbox label { width: 100%; }
 * ```
 */
.directive('ionCheckbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChecked: '=?',
      ngDisabled: '=?',
      ngChange: '&'
    },
    transclude: true,

    template: '<label class="item item-checkbox">' +
                '<div class="checkbox">' +
                  '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' +
                '</div>' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
              '</label>',

    compile: function(element, attr) {
      var input = element.find('input');
      if(attr.name) input.attr('name', attr.name);
      if(attr.ngChecked) input.attr('ng-checked', attr.ngChecked);
      if(attr.ngDisabled) input.attr('ng-disabled', attr.ngDisabled);
      if(attr.ngTrueValue) input.attr('ng-true-value', attr.ngTrueValue);
      if(attr.ngFalseValue) input.attr('ng-false-value', attr.ngFalseValue);
    }

  };
});

})();
