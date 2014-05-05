IonicModule
.factory('$collectionDataSource', [
  '$cacheFactory',
  '$parse',
function($cacheFactory, $parse) {
  var nextCacheId = 0;
  function CollectionRepeatDataSource(options) {
    var self = this;
    this.scope = options.scope;
    this.transcludeFn = options.transcludeFn;
    this.transcludeParent = options.transcludeParent;

    this.keyExpr = options.keyExpr;
    this.listExpr = options.listExpr;
    this.trackByExpr = options.trackByExpr;

    this.heightGetter = options.heightGetter;
    this.widthGetter = options.widthGetter;

    this.dimensions = [];
    this.data = [];

    if (this.trackByExpr) {
      var trackByGetter = $parse(this.trackByExpr);
      var hashFnLocals = {$id: hashKey};
      this.itemHashGetter = function(index, value) {
        hashFnLocals[self.keyExpr] = value;
        hashFnLocals.$index = index;
        return trackByGetter(self.scope, hashFnLocals);
      };
    } else {
      this.itemHashGetter = function(index, value) {
        return hashKey(value);
      };
    }

    var cacheKeys = {};
    this.itemCache = $cacheFactory(nextCacheId++, {size: 500});

    var _put = this.itemCache.put;
    this.itemCache.put = function(key, value) {
      cacheKeys[key] = true;
      return _put(key, value);
    };

    var _remove = this.itemCache.remove;
    this.itemCache.remove = function(key) {
      delete cacheKeys[key];
      return _remove(key);
    };
    this.itemCache.keys = function() {
      return Object.keys(cacheKeys);
    };
  }
  CollectionRepeatDataSource.prototype = {
    destroy: function() {
      this.dimensions.length = 0;
      this.itemCache.keys().forEach(function(key) {
        var item = this.itemCache.get(key);
        item.element.remove();
        item.scope.$destroy();
      }, this);
      this.itemCache.removeAll();
    },
    calculateDataDimensions: function() {
      var locals = {};
      this.dimensions = this.data.map(function(value, index) {
        locals[this.keyExpr] = value;
        locals.$index = index;
        return {
          width: this.widthGetter(this.scope, locals),
          height: this.heightGetter(this.scope, locals)
        };
      }, this);
    },
    compileItem: function(index, value) {
      var key = this.itemHashGetter(index, value);
      var cachedItem = this.itemCache.get(key);
      if (cachedItem) return cachedItem;

      var item = {};
      item.scope = this.scope.$new();
      item.scope[this.keyExpr] = value;

      this.transcludeFn(item.scope, function(clone) {
        item.element = clone;
        item.element[0].style.position = 'absolute';
      });

      return this.itemCache.put(key, item);
    },
    getItem: function(index) {
      var value = this.data[index];
      var item = this.compileItem(index, value);

      if (item.scope.$index !== index) {
        item.scope.$index = index;
        item.scope.$first = (index === 0);
        item.scope.$last = (index === (this.getLength() - 1));
        item.scope.$middle = !(item.scope.$first || item.scope.$last);
        item.scope.$odd = !(item.scope.$even = (index&1) === 0);
      }

      return item;
    },
    detachItem: function(item) {
      var i, node, parent;
      //Don't .remove(), that will destroy element data
      for (i = 0; i < item.element.length; i++) {
        node = item.element[i];
        parent = node.parentNode;
        parent && parent.removeChild(node);
      }
      //Don't .$destroy(), just stop watchers and events firing
      disconnectScope(item.scope);
    },
    attachItem: function(item) {
      if (!item.element[0].parentNode) {
        this.transcludeParent[0].appendChild(item.element[0]);
      }
      reconnectScope(item.scope);
      !item.scope.$$phase && item.scope.$digest();
    },
    getLength: function() {
      return this.data && this.data.length || 0;
    },
    setData: function(value) {
      this.data = value || [];
      this.calculateDataDimensions();
    },
  };

  return CollectionRepeatDataSource;
}]);

/**
* Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj) {
  var objType = typeof obj,
      key;

  if (objType == 'object' && obj !== null) {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = ionic.Utils.nextUid();
    }
  } else {
    key = obj;
  }

  return objType + ':' + key;
}

function disconnectScope(scope) {
  if (scope.$root === scope) {
    return; // we can't disconnect the root node;
  }
  var parent = scope.$parent;
  scope.$$disconnected = true;
  // See Scope.$destroy
  if (parent.$$childHead === scope) {
    parent.$$childHead = scope.$$nextSibling;
  }
  if (parent.$$childTail === scope) {
    parent.$$childTail = scope.$$prevSibling;
  }
  if (scope.$$prevSibling) {
    scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
  }
  if (scope.$$nextSibling) {
    scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
  }
  scope.$$nextSibling = scope.$$prevSibling = null;
}

function reconnectScope(scope) {
  if (scope.$root === scope) {
    return; // we can't disconnect the root node;
  }
  if (!scope.$$disconnected) {
    return;
  }
  var parent = scope.$parent;
  scope.$$disconnected = false;
  // See Scope.$new for this logic...
  scope.$$prevSibling = parent.$$childTail;
  if (parent.$$childHead) {
    parent.$$childTail.$$nextSibling = scope;
    parent.$$childTail = scope;
  } else {
    parent.$$childHead = parent.$$childTail = scope;
  }
}
