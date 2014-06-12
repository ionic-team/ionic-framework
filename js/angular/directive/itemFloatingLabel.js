/**
 * @ngdoc directive
 * @name itemFloatingLabel
 * @module ionic
 * @restrict C
 * @description
 * The floating label directive is a class directive that is used just like [item-stacked-label](http://ionicframework.com/docs/components/#forms-stacked-labels).
 *
 *
 * @usage
 * ```html
 * <label class="item item-input item-floating-label">
 *   <span class="input-label">First Name</span>
 *   <input type="text" placeholder="First Name">
 * </label> 
 * ```
 */
IonicModule
.directive('itemFloatingLabel', function() {
  return {
    restrict: 'C',
    link: function(scope, element) {
      var el = element[0];
      var input = el.querySelector('input,textarea');
      var inputLabel = el.querySelector('.input-label');
      
      if ( !input || !inputLabel ) return;

      var onKeyUp = function() {
        var hasInput = inputLabel.classList.contains('has-input');
        if ( input.value !== '' && !hasInput ) {
          inputLabel.classList.add('has-input');
        }
        else if ( input.value == '' && hasInput ) {
          inputLabel.classList.remove('has-input');
        };
      }

      input.addEventListener('keyup', onKeyUp); 

      scope.$on('$destroy', function() {
        input.removeEventListener('keyup', onKeyUp);
      });
    }
  }
})
