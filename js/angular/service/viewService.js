/**
 * @private
 * DEPRECATED, as of v1.0.0-beta14 -------
 */
IonicModule
.factory('$ionicViewService', ['$ionicHistory', '$log', function($ionicHistory, $log) {

  function warn(oldMethod, newMethod) {
    $log.warn('$ionicViewService' + oldMethod + ' is deprecated, please use $ionicHistory' + newMethod + ' instead: http://ionicframework.com/docs/nightly/api/service/$ionicHistory/');
  }

  warn('', '');

  var methodsMap = {
    getCurrentView: 'currentView',
    getBackView: 'backView',
    getForwardView: 'forwardView',
    getCurrentStateName: 'currentStateName',
    nextViewOptions: 'nextViewOptions',
    clearHistory: 'clearHistory'
  };

  forEach(methodsMap, function(newMethod, oldMethod) {
    methodsMap[oldMethod] = function() {
      warn('.' + oldMethod, '.' + newMethod);
      return $ionicHistory[newMethod].apply(this, arguments);
    };
  });

  return methodsMap;

}]);
