IonicModule
.directive('ionModalView', function() {
  return {
    restrict: 'E',
    compile: function(element, attr) {
      element.addClass('modal');
    }
  };
});
