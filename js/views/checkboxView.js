(function(ionic) {
'use strict';

  ionic.views.Checkbox = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.handle = opts.handle;
  };

  ionic.views.Checkbox.prototype = {

    tap: function(e) {
      this.val( !this.checkbox.checked );
    },

    val: function(value) {
      if(value === true || value === false) {
        this.checkbox.checked = value;
      }
      return this.checkbox.checked;
    }

  };

})(ionic);
