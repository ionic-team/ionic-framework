angular.module('ionic.ui.content', {})

.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="content"></div>'
  }
});
