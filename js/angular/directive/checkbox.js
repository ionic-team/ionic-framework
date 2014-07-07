
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

      // function link
      return function(scope, element, attr2){
        if(element[0].querySelector){
        	 // get the elements we need. label and checkboxIcon as event targets
          var label = element[0].querySelector(".item-content");
          var checkboxIcon = element[0].querySelector(".checkbox-icon");
          // input to update the change
          var input = element[0].querySelector(".checkbox input");

          function performClick(evt){
          	// stop propagation so other browsers don't re-toggle the checkbox
            evt.stopPropagation();

            input.checked = !input.checked;
            // Update the ngModel, if it's available
            if(attr.ngModel)
            	scope.$eval(attr.ngModel + "=" + input.checked);

            // And trigger ngChange, if it's available
            if(attr.ngChange){
              scope.$apply(function(){
                scope.$eval(attr.ngChange);
              });
            }
          }

          label.addEventListener('click', performClick);
          checkboxIcon.addEventListener('click', performClick);
        }
      }
    }

  };
});
