(function() {
'use strict';

/**
 * @description
 * The scroll directive lets you enable a content area for 
 * our custom momentum scrolling area. The benefit to a custom
 * scroll area is configurability, and avoidance of the 
 * buggy -webkit-overflow-scrolling: touch.
 */

angular.module('ionic.ui.scroll', [])

.directive('scroll', function() {
  return {
    restrict: 'ECA',
    replace: true,
    transclude: true,
    template: '<div class="scroll-content" ng-transclude></div>'
  };
});
