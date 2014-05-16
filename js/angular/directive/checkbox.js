
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
 */
/**
 * @ngdoc demo
 * @name ionCheckbox#simple
 * @module checkboxSimple
 * @javascript
 * var app = angular.module('checkboxSimple', ['ionic']);
 * app.controller('CheckboxSimpleCtrl', function($scope) {
 *   $scope.pizza = {
 *     pepperoni: true,
 *     sausage: false,
 *     anchovies: true,
 *     jalapenos: false
 *   };
 *
 *   $scope.toppings = function() {
 *     var toppings = Object.keys($scope.pizza).filter(function(flavor) {
 *       return $scope.pizza[flavor];
 *     });
 *     if (toppings.length > 1) {
 *       toppings[toppings.length - 1] = 'and ' + toppings[toppings.length - 1];
 *     }
 *     if (toppings.length > 2) {
 *       return toppings.join(', ');
 *     } else if (toppings.length) {
 *       return toppings.join(' ');
 *     } else {
 *       return 'nothing';
 *     }
 *   };
 * });
 *
 * @html
 * <ion-header-bar class="bar-positive">
 *   <h1 class="title">
 *     Checkbox: Simple Usage
 *   </h1>
 * </ion-header-bar>
 * <ion-content ng-controller="CheckboxSimpleCtrl" class="padding">
 *   <h3>Your pizza has {{toppings()}}!</h3>
 *   <ion-checkbox ng-model="pizza.pepperoni">
 *     Pepperoni?
 *   </ion-checkbox>
 *   <ion-checkbox ng-model="pizza.sausage">
 *     Sausage?
 *   </ion-checkbox>
 *   <ion-checkbox ng-model="pizza.anchovies">
 *     Jalapeno?
 *   </ion-checkbox>
 *   <ion-checkbox ng-model="pizza.jalapenos">
 *     Anchovies?
 *   </ion-checkbox>
 * </ion-content>
 */

IonicModule
.directive('ionCheckbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template: '<label class="item item-checkbox">' +
                '<div class="checkbox checkbox-input-hidden disable-pointer-events">' +
                  '<input type="checkbox">' +
                  '<i class="checkbox-icon"></i>' +
                '</div>' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
              '</label>',
    compile: function(element, attr) {
      var input = element.find('input');
      forEach({
        'name': attr.name,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'ng-checked': attr.ngChecked,
        'ng-disabled': attr.ngDisabled,
        'ng-true-value': attr.ngTrueValue,
        'ng-false-value': attr.ngFalseValue,
        'ng-change': attr.ngChange
      }, function(value, name) {
        if (isDefined(value)) {
          input.attr(name, value);
        }
      });
    }

  };
});
