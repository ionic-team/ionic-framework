(function(window, document, ionic) {
  NavController = function(opts) {
    var _this = this;

    this.navBar = opts.navBar;
    this.content = opts.content;
    this.controllers = opts.controllers || [];


    // TODO: Is this the best way?
    this.navBar.shouldGoBack = function() {
      _this.pop();
    }
  };

  NavController.prototype = {
    getControllers: function() {
      return this.controllers;
    },
    getTopController: function() {
      return this.topController;
    },
    push: function(controller) {
      var last = this.topController;

      this.controllers.push(controller);

      // Indicate we are switching controllers
      var shouldSwitch = this.switchingController && this.switchingController(controller) || true;

      // Return if navigation cancelled
      if(shouldSwitch === false)
        return;

      // Actually switch the active controllers

      // Remove the old one
      last && last.detach();

      // Grab the top controller on the stack
      var next = this.controllers[this.controllers.length - 1];

      // TODO: No DOM stuff here
      this.content.el.appendChild(next.el);

      // Switch to it (TODO: Animate or such things here)
      this.topController = next;

      this._updateNavBar();

      return controller;
    },

    pop: function() {
      var next, last;

      // Make sure we keep one on the stack at all times
      if(this.controllers.length < 2) {
        return;
      }

      // Grab the controller behind the top one on the stack
      last = this.controllers.pop();
      
      // Remove the old one
      last && last.detach();

      next = this.controllers[this.controllers.length - 1];

      // TODO: No DOM stuff here
      this.content.el.appendChild(next.el);

      // Switch to it (TODO: Animate or such things here)
      this.topController = next;

      this._updateNavBar();

      return last;
    },

    _updateNavBar: function() {
      this.navBar.setTitle(this.topController.title);

      if(this.controllers.length > 1) {
        this.navBar.showBackButton(true);
      } else {
        this.navBar.showBackButton(false);
      }
    },

  };
})(this, document, this.ionic || {});
