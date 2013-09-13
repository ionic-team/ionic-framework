TabBarController = function(options) {
  this.tabBar = options.tabBar;

  this._bindEvents();

  this.controllers = [];

  // Bind or set our tabWillChange callback
  this.controllerWillChange = options.controllerWillChange || function(controller) {};
  this.controllerChanged = options.controllerChanged || function(controller) {};
};

TabBarController.prototype = {
  // Start listening for events on our tab bar
  _bindEvents: function() {
    this.tabBar.onTabSelected = function(e) {
    };
  },

  selectController: function(index) {
    var shouldChange = true;

    // Check if we should switch to this tab. This lets the app
    // cancel tab switches if the context isn't right, for example.
    if(this.controllerWillChange) {
      if(this.controllerWillChange(this.controllers[index], index) === false) {
        shouldChange = false;
      }
    }

    if(shouldChange) {
      this.setSelectedController(index);
      this.controllerChanged && this.controllerChanged(this.selectedController, this.selectedIndex);
    }
  },

  // Force the selection of a controller at the given index
  setSelectedController: function(index) {
    this.selectedController = this.controllers[index];
    this.selectedIndex = index;
  },

  _clearSelected: function() {
    this.selectedController = null;
    this.selectedIndex = -1;
  },

  // Return the tab at the given index
  getController: function(index) {
    return this.controllers[index];
  },

  // Return the current tab list
  getControllers: function() {
    return this.controllers;
  },

  // Get the currently selected tab
  getSelectedController: function() {
    return this.selectedController;
  },

  // Add a tab
  addController: function(controller) {
    this.controllers.push(controller);

    // If we don't have a selected controller yet, select the first one.
    if(!this.selectedController) {
      this.setSelectedController(0);
    }
  },

  // Set the tabs and select the first
  setControllers: function(controllers) {
    this.controllers = controllers;
    this._clearSelected();
    this.selectController(0);
  }
}
