IonicModule
.directive('ionModalView', function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('modal');
    }
  };
});
