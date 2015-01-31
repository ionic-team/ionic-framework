/**
 * @private
 * DEPRECATED, as of v1.0.0-beta14 -------
 */
IonicModule
.factory('$ionicViewService', ['$ionicHistory', '$log', function($ionicHistory, $log) {

  function warn(oldMethod, newMethod) {
    $log.warn('$ionicViewService' + oldMethod + ' is deprecated, please use $ionicHistory' + newMethod + ' instead: http://ionicframework.com/docs/nightly/api/service/$ionicHistory/');
  }

  // always reset the keyboard state when change stage
  $rootScope.$on('$stateChangeStart', function(){
      //Windows: no hide method available
      if (ionic.keyboard.hide) {
          ionic.keyboard.hide();
      }
  });

  $rootScope.$on('viewState.changeHistory', function(e, data) {
    if(!data) return;

    var hist = (data.historyId ? $rootScope.$viewHistory.histories[ data.historyId ] : null );
    if(hist && hist.cursor > -1 && hist.cursor < hist.stack.length) {
      // the history they're going to already exists
      // go to it's last view in its stack
      var view = hist.stack[ hist.cursor ];
      return view.go(data);
    }

    // this history does not have a URL, but it does have a uiSref
    // figure out its URL from the uiSref
    if(!data.url && data.uiSref) {
      data.url = $state.href(data.uiSref);
    }

    if(data.url) {
      // don't let it start with a #, messes with $location.url()
      if(data.url.indexOf('#') === 0) {
        data.url = data.url.replace('#', '');
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
