IonicModule
.factory('$collectionDataSource', [
  '$cacheFactory',
  '$parse',
  '$rootScope',
function($cacheFactory, $parse, $rootScope) {
  function hideWithTransform(element) {
    element.css(ionic.CSS.TRANSFORM, 'translate3d(-2000px,-2000px,0)');
  }

  function CollectionRepeatDataSource(options) {
    var self = this;
    this.scope = options.scope;
    this.transcludeFn = options.transcludeFn;
    this.transcludeParent = options.transcludeParent;
    this.element = options.element;

    this.keyExpr = options.keyExpr;
    this.listExpr = options.listExpr;
    this.trackByExpr = options.trackByExpr;

    this.heightGetter = options.heightGetter;
    this.widthGetter = options.widthGetter;

    this.dimensions = [];
    this.data = [];

    this.attachedItems = {};
    this.BACKUP_ITEMS_LENGTH = 20;
    this.backupItemsArray = [];
  }
  CollectionRepeatDataSource.prototype = {
    setup: function() {
      if (this.isSetup) return;
      this.isSetup = true;
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
      this.dimensions = this.beforeSiblings.concat(this.dimensions).concat(this.afterSiblings);
      this.dataStartIndex = this.beforeSiblings.length;
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
    getItem: function(index) {
      var item;
      if ( (item = this.attachedItems[index]) ) {
        //do nothing, the item is good
      } else if ( (item = this.backupItemsArray.pop()) ) {
        ionic.Utils.reconnectScope(item.scope);
      } else {
        item = this.createItem();
      }
      return item;
    },
    attachItemAtIndex: function(index) {
      if (index < this.dataStartIndex) {
        return this.beforeSiblings[index];
      }
      // Subtract so we start at the beginning of this.data, after
      // this.beforeSiblings.
      index -= this.dataStartIndex;

      if (index > this.data.length - 1) {
        return this.afterSiblings[index - this.dataStartIndex];
      }

      var item = this.getItem(index);
      var value = this.data[index];

      if (item.index !== index || item.scope[this.keyExpr] !== value) {
        item.index = item.scope.$index = index;
        item.scope[this.keyExpr] = value;
        item.scope.$first = (index === 0);
        item.scope.$last = (index === (this.getLength() - 1));
        item.scope.$middle = !(item.scope.$first || item.scope.$last);
        item.scope.$odd = !(item.scope.$even = (index&1) === 0);

        //We changed the scope, so digest if needed
        if (!$rootScope.$$phase) {
          item.scope.$digest();
        }
      }
      this.attachedItems[index] = item;

      return item;
    },
    destroyItem: function(item) {
      item.element.remove();
      item.scope.$destroy();
      item.scope = null;
      item.element = null;
    },
    detachItem: function(item) {
      delete this.attachedItems[item.index];

      //If it's an outside item, only hide it. These items aren't part of collection
      //repeat's list, only sit outside
      if (item.isOutside) {
        hideWithTransform(item.element);
      // If we are at the limit of backup items, just get rid of the this element
      } else if (this.backupItemsArray.length >= this.BACKUP_ITEMS_LENGTH) {
        this.destroyItem(item);
      // Otherwise, add it to our backup items
      } else {
        this.backupItemsArray.push(item);
        hideWithTransform(item.element);
        //Don't .$destroy(), just stop watchers and events firing
        ionic.Utils.disconnectScope(item.scope);
      }

    },
    getLength: function() {
      return this.dimensions && this.dimensions.length || 0;
    },
    setData: function(value, beforeSiblings, afterSiblings) {
      this.data = value || [];
      this.beforeSiblings = beforeSiblings || [];
      this.afterSiblings = afterSiblings || [];
      this.calculateDataDimensions();

      this.afterSiblings.forEach(function(item) {
        item.element.css({position: 'absolute', top: '0', left: '0' });
        hideWithTransform(item.element);
      });
    },
  };

  return CollectionRepeatDataSource;
}]);
