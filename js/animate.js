(function(ionic) {
  ionic.Animator = {
    animate: function(element, className, fn) {
      return {
        leave: function() {
          var endFunc = function() {
            console.log('Animation finished for element', element);

            element.classList.remove('leave');
            element.classList.remove('leave-active');

            element.removeEventListener('webkitTransitionEnd', endFunc);
            element.removeEventListener('transitionEnd', endFunc);
          };
          element.addEventListener('webkitTransitionEnd', endFunc);
          element.addEventListener('transitionEnd', endFunc);

          element.classList.add('leave');
          element.classList.add('leave-active');
          return this;
        },
        enter: function() {
          var endFunc = function() {
            console.log('Animation finished for element', element);

            element.classList.remove('enter');
            element.classList.remove('enter-active');

            element.removeEventListener('webkitTransitionEnd', endFunc);
            element.removeEventListener('transitionEnd', endFunc);
          };
          element.addEventListener('webkitTransitionEnd', endFunc);
          element.addEventListener('transitionEnd', endFunc);

          element.classList.add('enter');
          element.classList.add('enter-active');

          return this;
        }
      };
    }
  };
})(ionic = window.ionic || {});
