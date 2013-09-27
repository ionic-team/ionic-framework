
(function(ionic) {

  ionic.views.Toggle = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.track = opts.track;
    this.handle = opts.handle;
  };

  ionic.views.Toggle.prototype = {

    tap: function(e) {
      alert( this.isOn() );
    },

    isOn: function() {
      return this.checkbox.checked;
    }

  };

})(ionic);
