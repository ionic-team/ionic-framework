TabBarItem = function(el) {
  this.el = el;
};
TabBarItem.prototype = {
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

    var items = this.el.children;

    for(var i = 0, j = items.length; i < j; i += 1) {
      this.items[i] = new TabBarItem(items[i]);
    }
  
    if(this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
  }
};

