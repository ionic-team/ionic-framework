
(function(ionic) {

  ionic.views.Toggle = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.track = opts.track;
    this.handle = opts.handle;
  };

  ionic.views.Toggle.prototype = {

    tap: function(e) {
      
    },

    val: function(value) {
      if(value === true || value === false) {
        this.checkbox.checked = value;
      }
      return this.checkbox.checked;
    }

  };

})(ionic);
