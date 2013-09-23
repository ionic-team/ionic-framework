(function(ionic) {

ionic.ui = ionic.ui || {};

ionic.ui.SideMenu = function(opts) {
  this.el = opts.el;
  this.width = opts.width;
  this.isEnabled = opts.isEnabled || true;
};

ionic.ui.SideMenu.prototype = {
  getFullWidth: function() {
    return this.width;
  },
  setIsEnabled: function(isEnabled) {
    this.isEnabled = isEnabled;
  },
  bringUp: function() {
    this.el.style.zIndex = 0;
  },
  pushDown: function() {
    this.el.style.zIndex = -1;
  }
};
})(ionic = window.ionic || {});
