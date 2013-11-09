(function(ionic) {
'use strict';

  ionic.views.SideMenu = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
      this.width = opts.width;
      this.isEnabled = opts.isEnabled || true;
    },

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
  });

})(ionic);
