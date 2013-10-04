(function(ionic) {
  ionic.views.Modal = function(opts) {
    this.el = opts.el;
  };

  ionic.views.Modal.prototype = {
    show: function() {
      this.el.classList.add('active');
    },
    hide: function() {
      this.el.classList.remove('active');
    }
  };

})(ionic);
