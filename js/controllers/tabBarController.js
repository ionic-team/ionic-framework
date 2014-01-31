(function(ionic) {
'use strict';

/**
 * The TabBarController handles a set of view controllers powered by a tab strip
 * at the bottom (or possibly top) of a screen.
 *
 * The API here is somewhat modelled off of UITabController in the sense that the
 * controllers actually define what the tab will look like (title, icon, etc.).
 *
 * Tabs shouldn't be interacted with through your own code. Instead, use the controller
 * methods which will power the tab bar.
 */
ionic.controllers.TabBarController = ionic.controllers.ViewController.inherit({
  initialize: function(options) {
    this.tabBar = options.tabBar;

    this._bindEvents();

    this.controllers = [];

    var controllers = options.controllers || [];

    for(var i = 0; i < controllers.length; i++) {
      this.addController(controllers[i]);
    }

    // Bind or set our tabWillChange callback
    this.controllerWillChange = options.controllerWillChange || function(controller) {};
    this.controllerChanged = options.controllerChanged || function(controller) {};

    // Try to select the first controller if we have one
    this.setSelectedController(0);
  },
  // Start listening for events on our tab bar
  _bindEvents: function() {
    var _this = this;

    this.tabBar.tryTabSelect = function(index) {
      _this.setSelectedController(index);
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
    }
  },

  // Force the selection of a controller at the given index
  setSelectedController: function(index) {
    if(index >= this.controllers.length) {
      return;
    }
    var lastController = this.selectedController;
    var lastIndex = this.selectedIndex;

    this.selectedController = this.controllers[index];
    this.selectedIndex = index;

    this._showController(index);
    this.tabBar.setSelectedItem(index);

    this.controllerChanged && this.controllerChanged(lastController, lastIndex, this.selectedController, this.selectedIndex);
  },

  _showController: function(index) {
    var c;

    for(var i = 0, j = this.controllers.length; i < j; i ++) {
      c = this.controllers[i];
      //c.detach && c.detach();
      c.isVisible = false;
      c.visibilityChanged && c.visibilityChanged();
    }

    c = this.controllers[index];
    //c.attach && c.attach();
    c.isVisible = true;
    c.visibilityChanged && c.visibilityChanged();
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

  // Get the currently selected controller
  getSelectedController: function() {
    return this.selectedController;
  },

  // Get the index of the currently selected controller
  getSelectedControllerIndex: function() {
    return this.selectedIndex;
  },

  // Add a tab
  addController: function(controller) {
    this.controllers.push(controller);

    this.tabBar.addItem({
      title: controller.title,
      icon: controller.icon,
      badge: controller.badge
    });

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
  },
});

})(window.ionic);
