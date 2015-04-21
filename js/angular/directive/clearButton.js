/**
 * @ngdoc directive
 * @name clearButton
 * @module ionic
 * @restrict A
 *
 * @description
 * Displays an 'x' on the right of the input that when clicked will clear
 * the contents of the text box by setting the model value to undefined.
 *
 * @usage
 * Below is an example of a text based input with a clear button turned on.
 *
 * ```html
 * <input type="text" clear-button ng-model="person.name" />
 * ```
 * @param {string=} clear-button-text The text that should be displayed on the
 * button. Default: &times;.
 */
IonicModule
  .directive('clearButton', function () {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function ($scope, $element, $attr, ngModel) {
        var clear = function () {
          if (ngModel) {
            ngModel.$setViewValue('');
            $element.val(ngModel.$viewValue || '');
          } else {
            $element.val('');
          }
        };

        var xbtn = document.createElement('button');
        xbtn.innerHTML = $attr.clearButtonText || '&times;';
        xbtn.classList.add('ion-clear-button');

        ionic.onGesture('tap', function () {
          $scope.$evalAsync(clear);
        }, xbtn);

        $element[0].parentNode.insertBefore(xbtn, $element[0].nextSibling);
      }
    };
  });
