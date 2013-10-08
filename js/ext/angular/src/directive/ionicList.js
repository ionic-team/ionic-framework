angular.module('ionic.ui.list', ['ionic.service'])

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {},
    template: '<ul class="list-group" ng-transclude></ul>'
  }
})
