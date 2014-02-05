(function(ionic) {
'use strict';

ionic.views.TabBarItem = ionic.views.View.inherit({
  initialize: function(el) {
    this.el = el;

    this._buildItem();
  },

  // Factory for creating an item from a given javascript object
  create: function(itemData) {
    var item = document.createElement('a');
    item.className = 'tab-item';

    // If there is an icon, add the icon element
    if(itemData.icon) {
      var icon = document.createElement('i');
      icon.className = itemData.icon;
      item.appendChild(icon);
    }

    // If there is a badge, add the badge element
    if(itemData.badge) {
      var badge = document.createElement('i');
      badge.className = 'badge';
      badge.innerHTML = itemData.badge;
      item.appendChild(badge);
      item.className = 'tab-item has-badge';
    }

    item.appendChild(document.createTextNode(itemData.title));

    return new ionic.views.TabBarItem(item);
  },

  _buildItem: function() {
    var _this = this, child, children = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = children.length; i < j; i++) {
      child = children[i];

      // Test if this is a "i" tag with icon in the class name
      // TODO: This heuristic might not be sufficient
      if(child.tagName.toLowerCase() == 'i' && /icon/.test(child.className)) {
        this.icon = child.className;
      }

      // Test if this is a "i" tag with badge in the class name
      // TODO: This heuristic might not be sufficient
      if(child.tagName.toLowerCase() == 'i' && /badge/.test(child.className)) {
        this.badge = child.textContent.trim();
      }
    }

    this.title = '';
    for(i = 0, j = this.el.childNodes.length; i < j; i++) {
      child = this.el.childNodes[i];

      if (child.nodeName === "#text") {
        this.title += child.nodeValue.trim();
      }
    }

    this._tapHandler = function(e) {
      _this.onTap && _this.onTap(e);
    };

    ionic.on('tap', this._tapHandler, this.el);
  },
  onTap: function(e) {
  },

  // Remove the event listeners from this object
  destroy: function() {
    ionic.off('tap', this._tapHandler, this.el);
  },

  getIcon: function() {
    return this.icon;
  },

  getTitle: function() {
    return this.title;
  },

  getBadge: function() {
    return this.badge;
  },

  setSelected: function(isSelected) {
    this.isSelected = isSelected;
    if(isSelected) {
      this.el.classList.add('active');
    } else {
      this.el.classList.remove('active');
    }
  }
});

ionic.views.TabBar = ionic.views.View.inherit({
  initialize: function(opts) {
    this.el = opts.el;
     
    this.items = [];

    this._buildItems();
  },
  // get all the items for the TabBar
  getItems: function() {
    return this.items;
  },

  // Add an item to the tab bar
  addItem: function(item) {
    // Create a new TabItem
    var tabItem = ionic.views.TabBarItem.prototype.create(item);

    this.appendItemElement(tabItem);

    this.items.push(tabItem);
    this._bindEventsOnItem(tabItem);
  },

  appendItemElement: function(item) {
    if(!this.el) {
      return;
    }
    this.el.appendChild(item.el);
  },

  // Remove an item from the tab bar
  removeItem: function(index) {
    var item = this.items[index];
    if(!item) {
      return;
    }
    item.onTap = undefined;
    item.destroy();
  },

  _bindEventsOnItem: function(item) {
    var _this = this;

    if(!this._itemTapHandler) {
      this._itemTapHandler = function(e) {
        //_this.selectItem(this);
        _this.trySelectItem(this);
      };
    }
    item.onTap = this._itemTapHandler;
  },

  // Get the currently selected item
  getSelectedItem: function() {
    return this.selectedItem;
  },

  // Set the currently selected item by index
  setSelectedItem: function(index) {
    this.selectedItem = this.items[index];

    // Deselect all
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      this.items[i].setSelected(false);
    }

    // Select the new item
    if(this.selectedItem) {
      this.selectedItem.setSelected(true);
      //this.onTabSelected && this.onTabSelected(this.selectedItem, index);
    }
  },

  // Select the given item assuming we can find it in our
  // item list.
  selectItem: function(item) {
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      if(this.items[i] == item) {
        this.setSelectedItem(i);
        return;
      }
    }
  },

  // Try to select a given item. This triggers an event such
  // that the view controller managing this tab bar can decide
  // whether to select the item or cancel it.
  trySelectItem: function(item) {
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      if(this.items[i] == item) {
        this.tryTabSelect && this.tryTabSelect(i);
        return;
      }
    }
  },

  // Build the initial items list from the given DOM node.
  _buildItems: function() {

    var item, items = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = items.length; i < j; i += 1) {
      item =  new ionic.views.TabBarItem(items[i]);
      this.items[i] = item;
      this._bindEventsOnItem(item);
    }
  
    if(this.items.length > 0) {
      this.selectedItem = this.items[0];
    }

  },

  // Destroy this tab bar
  destroy: function() {
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      this.items[i].destroy();
    }
    this.items.length = 0;
  }
});

})(window.ionic);
