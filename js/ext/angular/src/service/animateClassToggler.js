/**
 * Stop race conditions with toggling an ngAnimate on an element rapidly,
 * due to the asynchronous nature of addClass and removeClass
 *
 * Additionally, only toggle classes on requestAnimationFrame, to stop flickers on
 * iOS and older android for elements that were just attached to the DOM.
 */
angular.module('ionic')
.factory('$animateClassToggler', [
  '$animate',
  '$rootScope',
function($animate, $rootScope) {

  return function(element, className) {

    var self = {
      _nextOperation: null,
      _animating: false,
      _toggle: toggle,
      _animate: animate,
      _animationDone: animationDone,
      addClass: function() { self._toggle(true); },
      removeClass: function() { self._toggle(false); }
    };

    return self;

    function toggle(hasClass) {
      var operation = hasClass ? 'addClass' : 'removeClass';
      if (self._animating) {
        self._nextOperation = operation;
      } else {
        self._animate(operation);
      }
    }

    function animate(operation) {
      self._animating = true;
      ionic.requestAnimationFrame(function() {
        $rootScope.$evalAsync(function() {
          $animate[operation](element, className, self._animationDone);
        });
      });
    }

    function animationDone() {
      self._animating = false;
      if (self._nextOperation) {
        self._animate(self._nextOperation);
        self._nextOperation = null;
      }
    }
  };
}]);

