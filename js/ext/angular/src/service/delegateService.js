
function delegateService(methodNames) {
  return ['$log', function($log) {
    var delegate = this;

    this._instances = {};
    this._registerInstance = function(instance, handle) {
      handle || (handle = ionic.Utils.nextUid());
      delegate._instances[handle] = instance;

      return function deregister() {
        delete delegate._instances[handle];
      };
    };

    this.forHandle = function(handle) {
      if (!handle) {
        return delegate;
      }
      return new InstanceForHandle(handle);
    };

    /*
     * Creates a new object that will have all the methodNames given,
     * and call them on the given the controller instance matching given
     * handle.
     * The reason we don't just let forHandle return the controller instance
     * itself is that the controller instance might not exist yet.
     *
     * We want people to be able to do
     * `var instance = $ionicScrollDelegate.forHandle('foo')` on controller
     * instantiation, but on controller instantiation a child directive
     * may not have been compiled yet!
     *
     * So this is our way of solving this problem: we create an object
     * that will only try to fetch the controller with given handle
     * once the methods are actually called.
     */
    function InstanceForHandle(handle) {
      this.handle = handle;
    }
    methodNames.forEach(function(methodName) {
      InstanceForHandle.prototype[methodName] = function() {
        var instance = delegate._instances[this.handle];
        if (!instance) {
          return $log.error(
            'Delegate with handle "'+this.handle+'" could not find a',
            'corresponding element with delegate-handle="'+this.handle+'"!',
            methodName, 'was not called!');
        }
        return instance[methodName].apply(instance, arguments);
      };
      delegate[methodName] = function() {
        var args = arguments;
        var returnValue;
        angular.forEach(delegate._instances, function(instance) {
          var result = instance[methodName].apply(instance, args);
          if (!angular.isDefined(returnValue)) {
            returnValue = result;
          }
        });
        return returnValue;
      };
    });
  }];
}
