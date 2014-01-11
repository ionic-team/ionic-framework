angular.module('ionic.service.loading', [])

.provider('Loading', function() {
  // Configuration functions
  var self = this;
  var resetOnRouteChange = true;
  this.resetOnRouteChange = function(b) {
    resetOnRouteChange = !!b;
  };

  var count = 0;
  var content = '';
  var contents = {};
  var order = [];
  var scopes = [];
  var loaderCount = 0;

  this.isLoading = function() {
    return !!count;
  };

  this.informScopes = function(){
    angular.forEach(scopes, function(scope){
      if(content) {
        scope.content = content;
      }
      scope.load = self.isLoading();
      scope.refresh();
    });
  };

  this.addLoader = function(loaderId, c) {
    var needInform = false;
    if(c) {
      order.push(loaderId);
      contents[loaderId] = c;
      if(order.length === 1) {
        content = c;
      }
    }
    // Change from 0 to 1
    if(!count){
      needInform = true;
    }

    count += 1;
    needInform ? self.informScopes() : null;
  };

  this.removeLoader = function(loaderId) {
    var needInform = false;
    // Handle content
    var i = 0, l = order.length;
    for(i;i<l;i++){
      if(order[i] === loaderId) {
        order.splice(i,1);
        // Removing first item, change content
        if(i === 0) {
          // See if this is the last content
          if(order.length){
            needInform = true;
            content = contents[order[0]];
          }
        }
        // Remove content from contents
        delete contents[loaderId];
        break;
      }
    }
    if(count) {
      needInform = true;
    }
    
    count = Math.max(0, count - 1);
    needInform ? self.informScopes() : null;
  };


  this.$get = function($q, $timeout) {
    return {
      registerScope: function(scope) {
        scopes.push(scope);
        // Inform the scope of the current state
        // TODO: This is an unclean way to handle the race condition between show and adding scope. We need to find something better
        scope.load = !!count;
        scope.content = content;
        scope.refresh();
      },
      unregisterScope: function(scope){
        var i, l = scopes.length;
        for(i=0; i<l; i++){
          if(scope === scopes[i]) {
            scopes.splice(i,1);
            break;
          }
        }
      },
      /**
       * Shows a loader. Returns a promise-like object extended with a .stop method
       * Promise object is rejected on timeout, resolved on normal stop
       *
       * @param {object} opts the options for this Loader (see docs)
       */
      show: function(opts) {
        // Keep some options: content and timeout
        var timeout = opts.timeout;

        var q = $q.defer();

        // Set up timeout
        if(timeout) {
          $timeout(function() {
            q.reject();
          }, timeout);
        }
        var thisLoaderId = loaderCount++;
        q.promise.finally(angular.bind(self, self.removeLoader, thisLoaderId));

        q.promise.stop = q.resolve;
        // Keep track of loading
        self.addLoader(thisLoaderId, opts.content);

        return q.promise;
      }
    };

  };
});
