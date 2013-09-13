TabBarItem = function(el) {
  this.el = el;

  this._buildItem();
};
TabBarItem.prototype = {
  _buildItem: function() {
    var child, children = Array.prototype.slice.call(this.el.children);

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
  this._buildItems();
};

TabBar.prototype = {
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
    this.items = [];

    var items = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = items.length; i < j; i += 1) {
      this.items[i] = new TabBarItem(items[i]);
    }
  
    if(this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
  }
};

