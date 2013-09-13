(function(window, document, ionic) {

TabBarItem = function(el) {
  this.el = el;

  this._buildItem();
};
TabBarItem.prototype = {
  _buildItem: function() {
    var _this = this, child, children = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = children.length; i < j; i++) {
      child = children[i];

      // Test if this is a "i" tag with icon in the class name
      // TODO: This heuristic might not be sufficient
      if(child.tagName == 'i' && /icon/.test(child.className)) {
        this.icon = child;
        break;
      }

    }

    // Set the title to the text content of the tab.
    this.title = this.el.innerText.trim();

    this._tapHandler = function(e) {
      console.log('TAP', e);
      _this.onTap();
    };

    ionic.on('click', this._tapHandler, this.el);
    ionic.on('tap', this._tapHandler, this.el);
  },

  onTap: function() {},

  // Remove the event listeners from this object
  destroy: function() {
    ionic.off('click', this._tapHandler, this.el);
    ionic.off('tap', this._tapHandler, this.el);
  },

  getIcon: function() {
    return this.icon;
  },

  getTitle: function() {
    return this.title;
  },

  setSelected: function(isSelected) {
    this.isSelected = isSelected;
    if(isSelected) {
      this.el.classList.add('active');
    } else {
      this.el.classList.remove('active');
    }
  }
};

TabBar = function(opts) {
  this.el = opts.el;
   
  this.items = [];

  this._buildItems();
};

TabBar.prototype = {
  addItem: function(item) {
    this.items.push(item);
    this._bindEventsOnItem(item);
  },

  removeItem: function(index) {
    var item = this.items[index];
    if(!item) {
      return;
    }
    item.onSelect = undefined;
    item.destroy();
  },

  _itemActivateHandler: function(e) {
  },

  _bindEventsOnItem: function(item) {
    item.onSelect = function() {
      console.log(item.title + ' selected!');
    }
  },

  getSelectedItem: function() {
    return this.selectedItem;
  },
  setSelectedItem: function(index) {
    this.selectedItem = this.items[index];

    // Deselect all
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      this.items[i].setSelected(false);
    }

    // Select the new item
    this.selectedItem && this.selectedItem.setSelected(true);
  },

  getItems: function() {
    return this.items;
  },

  _buildItems: function() {

    var item, items = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = items.length; i < j; i += 1) {
      item =  new TabBarItem(items[i]);
      this.items[i] = item;
      this._bindEventsOnItem(item);
    }
  
    if(this.items.length > 0) {
      this.selectedItem = this.items[0];
    }

  }
};

})(this, document, ion = this.ionic || {});
