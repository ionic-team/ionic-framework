(function(ionic) {
  ionic.Animator = {
    animate: function(element, fn) {
      var endFunc = function() {
        console.log('Animation finished for element', element);
        element.removeEventListener('webkitTransitionEnd', endFunc);
        element.removeEventListener('transitionEnd', endFunc);
      };
      element.addEventListener('webkitTransitionEnd', endFunc);
      element.addEventListener('transitionEnd', endFunc);

      element.classList.add('enter');
    }
  };
})(ionic = window.ionic || {});
