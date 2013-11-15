(function(ionic) {
'use strict';

angular.module('ionic.ui.radio', [])

// The radio button is a radio powered element with only
// one possible selection in a set of options.
.directive('radio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      value: '@'
    },
    transclude: true,
    template: '<label class="item item-radio">\
                <input type="radio" name="group">\
                <div class="item-content" ng-transclude>\
                </div>\
                <i class="radio-icon icon ion-checkmark"></i>\
              </label>',

    link: function($scope, $element, $attr, ngModel) {
      var radio;

      if(!ngModel) { return; }

      radio = $element.children().eq(0);

      if(!radio.length) { return; }

      var tapHandler = function(e) {
        radio[0].checked = true;
        ngModel.$setViewValue($scope.$eval($attr.ngValue));
        e.preventDefault();
      };

      var clickHandler = function(e) {
        ngModel.$setViewValue($scope.$eval($attr.ngValue));
      };

      $scope.$on('$destroy', function() {
        $element.unbind('tap', tapHandler);
        $element.unbind('click', clickHandler);
      });

      if(ngModel) {
        $element.bind('tap', tapHandler);
        $element.bind('click', clickHandler);

        ngModel.$render = function() {
          var val = $scope.$eval($attr.ngValue);
          if(val === ngModel.$viewValue) {
            radio.attr('checked', 'checked');
          } else {
            radio.removeAttr('checked');
          }
        };
      }
    }
  };
});

})(window.ionic);
