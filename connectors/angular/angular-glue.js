/* used to tie angular.js with the framework */
/* nowhere should the framework reference angular.js */
/* nowhere in angular.js should it reference the framework */

var ionic = angular.module('ionic', ['ngTouch']);

ionic.directive('panel', ['$parse', '$timeout', '$rootElement',
    function($parse, $timeout, $rootElement) {
      return function(scope, element, attrs) {
      };
    }
]);
