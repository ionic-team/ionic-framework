(function(window, document, ionic) {
  NavController = function(opts) {
    var _this = this;

    console.log('CONSTRUCTOR', this);

    this.navBar = opts.navBar;
    this.content = opts.content;
    this.controllers = opts.controllers || [];

    this._updateNavBar();

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
      return this.controllers[this.controllers.length-1];
    },
    push: function(controller) {
      console.log('PUSHING');

      var last = this.controllers[this.controllers.length - 1];

      this.controllers.push(controller);

      // Indicate we are switching controllers
      var shouldSwitch = this.switchingController && this.switchingController(controller) || true;

      // Return if navigation cancelled
      if(shouldSwitch === false)
        return;

      // Actually switch the active controllers

      // Remove the old one
      //last && last.detach();
      if(last) {
        last.isVisible = false;
        last.visibilityChanged && last.visibilityChanged();
      }

      // Grab the top controller on the stack
      var next = this.controllers[this.controllers.length - 1];

      // TODO: No DOM stuff here
      //this.content.el.appendChild(next.el);
      console.log('Top controller modified', this.topController);

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
      //last && last.detach();

      next = this.controllers[this.controllers.length - 1];

      // TODO: No DOM stuff here
      //this.content.el.appendChild(next.el);

      // Switch to it (TODO: Animate or such things here)
      this.topController = next;
      console.log('Top controller modified', this.topController);

      this._updateNavBar();

      return last;
    },

    _updateNavBar: function() {
      if(!this.topController) {
        return;
      }

      this.navBar.setTitle(this.topController.title);

      if(this.controllers.length > 1) {
        this.navBar.showBackButton(true);
      } else {
        this.navBar.showBackButton(false);
      }
    },

  };
})(this, document, this.ionic || {});
