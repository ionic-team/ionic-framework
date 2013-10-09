angular.module('ionic.ui.list', ['ionic.service'])

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {},
    template: '<ul class="list-group" ng-transclude></ul>',
    link: function($scope, $element, $attr) {
      var lv = new ionic.views.List({el: $element[0]});
    }
  }
})

/*
.directive('listItem', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {}
  }
});
*/
