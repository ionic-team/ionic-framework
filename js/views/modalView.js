(function(ionic) {
'use strict';

  ionic.views.Modal = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
    },
    show: function() {
      this.el.classList.add('active');
    },
    hide: function() {
      this.el.classList.remove('active');
    }
  });

})(ionic);
