/**
 * @private
 * Parts of Ionic requires that $scope data is attached to the element.
 * We do not want to disable adding $scope data to the $element when
 * $compileProvider.debugInfoEnabled(false) is used.
 */
IonicModule.config(['$provide', function($provide) {
  $provide.decorator('$compile', ['$delegate', function($compile) {
     $compile.$$addScopeInfo = function $$addScopeInfo($element, scope, isolated, noTemplate) {
       var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
       $element.data(dataName, scope);
     };
     return $compile;
  }]);
}]);
