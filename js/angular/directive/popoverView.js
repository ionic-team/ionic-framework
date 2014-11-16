IonicModule
.directive('ionPopoverView', function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.append( angular.element('<div class="popover-arrow"></div>') );
      element.addClass('popover');
    }
  };
});
