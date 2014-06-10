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
 * <ion-radio ng-model="choice" ng-value="A">Choose A</ion-radio>
 * <ion-radio ng-model="choice" ng-value="B">Choose B</ion-radio>
 * <ion-radio ng-model="choice" ng-value="C">Choose C</ion-radio>
 * ```
 */
IonicModule
.directive('ionRadio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      ngModel: '=?',
      ngValue: '=?',
      ngChange: '&',
      icon: '@',
      name: '@'
    },
    transclude: true,
    template: '<label class="item item-radio">' +
                '<input type="radio" name="radio-group"' +
                ' ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
                '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
              '</label>',

    compile: function(element, attr) {
      if(attr.name) element.children().eq(0).attr('name', attr.name);
      if(attr.icon) element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);
    }
  };
});
