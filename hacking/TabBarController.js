TabBar = function(element) {
  this.element = element;
}
TabBar.prototype = {};

TabBarController = function(options) {
  this.tabBar = options.tabBar;

  this.tabs = [];

  // Bind or set our tabWillChange callback
  this.tabWillChange = options.tabWillChange || function(tab) {};
  this.tabChanged = options.tabChanged || function(tab) {};
};

TabBarController.prototype = {
  selectTab: function(index) {
    var shouldChange = true;

    // Check if we should switch to this tab. This lets the app
    // cancel tab switches if the context isn't right, for example.
    if(this.tabWillChange) {
      if(this.tabWillChange(this.tabs[index], index) === false) {
        shouldChange = false;
      }
    }

    if(shouldChange) {
      this.selectedTab = this.tabs[index];
      this.tabChanged && this.tabChanged(this.selectedTab, index);
    }
  },

  // Return the tab at the given index
  getTab: function(index) {
    return this.tabs[index];
  },

  // Return the current tab list
  getTabs: function() {
    return this.tabs;
  },

  // Get the currently selected tab
  getSelectedTab: function() {
    return this.selectedTab;
  },

  // Add a tab
  addTab: function(tab) {
    this.tabs.push(tab);
    if(!this.selectedTab) {
      this.selectedTab = tab;
    }
  },

  // Set the tabs and select the first
  setTabs: function(tabs) {
    this.tabs = tabs;
    this.selectTab(0);
  }
}