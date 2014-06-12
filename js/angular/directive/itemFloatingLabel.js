
IonicModule
.directive('itemFloatingLabel', function() {
  return {
    restrict: 'C',
    link: function(scope, element) {
      var el = element[0];
      var input = el.querySelector('input, textarea');
      var inputLabel = el.querySelector('.input-label');

      if ( !input || !inputLabel ) return;

      var onInput = function() {
        var hasInput = inputLabel.classList.contains('has-input');
        if ( input.value && !hasInput ) {
          inputLabel.classList.add('has-input');
        }
        else if ( !input.value && hasInput ) {
          inputLabel.classList.remove('has-input');
        }
      };

      input.addEventListener('input', onInput);

      var ngModelCtrl = angular.element(input).controller('ngModel');
      if ( ngModelCtrl ) {
        ngModelCtrl.$render = function() {
          input.value = ngModelCtrl.$viewValue || '';
          if ( ngModelCtrl.$viewValue ) input.value = ngModelCtrl.$viewValue;
          else input.value = '';
          onInput();
        };
      }

      scope.$on('$destroy', function() {
        input.removeEventListener('input', onInput);
      });
    }
  };
});
