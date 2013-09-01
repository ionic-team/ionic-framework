
(function(window, document, ion) {
  ion.controllers = ion.controllers || {};

  ion.controllers.TabController = function(options) {
    this.viewControllers = [];
    this.selectedViewController = null;

    var tabChildren = options.tab.querySelectorAll('.tab-item');
    console.log("Building from", tabChildren.length, "tab items");
    for(var i = 0; i < tabChildren.length; i++) {
    }
  };
  
  ion.controllers.TabController.prototype = {

  };

})(this, document, ion = this.ion || {});
