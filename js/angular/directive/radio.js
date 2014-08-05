/**
 * @ngdoc directive
 * @name ionRadio
 * @module ionic
 * @restrict E
 * @codepen saoBG
 * @description
 * The radio directive is no different than the HTML radio input, except it's styled differently.
 *
 * Radio behaves like any [AngularJS radio](http://docs.angularjs.org/api/ng/input/input[radio]).
 *
 * @usage
 * ```html
 * <ion-radio ng-model="choice" ng-value="'A'">Choose A</ion-radio>
 * <ion-radio ng-model="choice" ng-value="'B'">Choose B</ion-radio>
 * <ion-radio ng-model="choice" ng-value="'C'">Choose C</ion-radio>
 * ```
 */
IonicModule
.directive('ionRadio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<label class="item item-radio">' +
        '<input type="radio" name="radio-group">' +
        '<div class="item-content disable-pointer-events" ng-transclude></div>' +
        '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
      '</label>',

    compile: function(element, attr) {
      if(attr.icon) element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);
      var input = element.find('input');
      forEach({
          'name': attr.name,
          'value': attr.value,
          'disabled': attr.disabled,
          'ng-value': attr.ngValue,
          'ng-model': attr.ngModel,
          'ng-disabled': attr.ngDisabled,
          'ng-change': attr.ngChange
      }, function(value, name) {
        if (isDefined(value)) {
            input.attr(name, value);
          }
      });

      return function(scope, element, attr) {
        scope.getValue = function() {
          return scope.ngValue || attr.value;
        };
      };
    }
  };
});
