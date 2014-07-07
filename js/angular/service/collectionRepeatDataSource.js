IonicModule
.factory('$collectionDataSource', [
  '$cacheFactory',
  '$parse',
  '$rootScope',
function($cacheFactory, $parse, $rootScope) {

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

    this.attachedItems = {};
    this.BACKUP_ITEMS_LENGTH = 10;
    this.backupItemsArray = [];
  }
  CollectionRepeatDataSource.prototype = {
    setup: function() {
      for (var i = 0; i < this.BACKUP_ITEMS_LENGTH; i++) {
        this.detachItem(this.createItem());
      }
    },
    destroy: function() {
      this.dimensions.length = 0;
      this.data = null;
      this.backupItemsArray.length = 0;
      this.attachedItems = {};
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
    createItem: function() {
      var item = {};
      item.scope = this.scope.$new();

      this.transcludeFn(item.scope, function(clone) {
        clone.css('position', 'absolute');
        item.element = clone;
      });

      this.transcludeParent.append(item.element);

      return item;
    },
    getItem: function(hash) {
      if ( (item = this.attachedItems[hash]) ) {
        //do nothing, the item is good
      } else if ( (item = this.backupItemsArray.pop()) ) {
        reconnectScope(item.scope);
      } else {
        item = this.createItem();
      }
      return item;
    },
    attachItemAtIndex: function(index) {
      var value = this.data[index];
      var hash = this.itemHashGetter(index, value);
      var item = this.getItem(hash);

      if (item.scope.$index !== index || item.scope[this.keyExpr] !== value) {
        item.scope[this.keyExpr] = value;
        item.scope.$index = index;
        item.scope.$first = (index === 0);
        item.scope.$last = (index === (this.getLength() - 1));
        item.scope.$middle = !(item.scope.$first || item.scope.$last);
        item.scope.$odd = !(item.scope.$even = (index&1) === 0);

        //We changed the scope, so digest if needed
        if (!$rootScope.$$phase) {
          item.scope.$digest();
        }
      }

      item.hash = hash;
      this.attachedItems[hash] = item;

      return item;
    },
    destroyItem: function(item) {
      item.element.remove();
      item.scope.$destroy();
      item.scope = null;
      item.element = null;
    },
    detachItem: function(item) {
      delete this.attachedItems[item.hash];

      // If we are at the limit of backup items, just get rid of the this element
      if (this.backupItemsArray.length >= this.BACKUP_ITEMS_LENGTH) {
        this.destroyItem(item);
      // Otherwise, add it to our backup items
      } else {
        this.backupItemsArray.push(item);
        item.element.css(ionic.CSS.TRANSFORM, 'translate3d(-2000px,-2000px,0)');
        //Don't .$destroy(), just stop watchers and events firing
        disconnectScope(item.scope);
      }
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
