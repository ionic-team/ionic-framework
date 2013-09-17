(function(window, document, ionic) {
  NavController = function(opts) {
    this.navBar = opts.navBar;
    this.controllers = opts.controllers || [];
  };

  NavController.prototype = {
    getControllers: function() {
      return this.controllers;
    },
    getTopController: function() {
      return this.topController;
    },
    push: function(controller) {
      this.controllers.push(controller);

      // Indicate we are switching controllers
      var shouldSwitch = this.switchingController && this.switchingController(controller) || true;

      // Return if navigation cancelled
      if(shouldSwitch === false)
        return;

      // Actually switch the active controllers

      // Grab the top controller on the stack
      var next = this.controllers[this.controllers.length - 1];
      // Switch to it (TODO: Animate or such things here)
      this.topController = next;

      return controller;
    },


    pop: function() {
      var next, last;

      // Grab the controller behind the top one on the stack
      last = this.controllers.pop();

      next = this.controllers[this.controllers.length - 1];

      // Switch to it (TODO: Animate or such things here)
      this.topController = next;

      return last;
    }
  };
})(this, document, this.ionic || {});
