(function(ionic) {
'use strict';

  ionic.views.Modal = ionic.views.View.inherit({
    initialize: function(opts) {
      opts = ionic.extend({
        focusFirstInput: false,
        unfocusOnHide: true
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;
    },
    show: function() {
      this.el.classList.add('active');

      if(this.focusFirstInput) {
        var input = this.el.querySelector('input, textarea');
        input && input.focus && input.focus();
      }
    },
    hide: function() {
      this.el.classList.remove('active');

      // Unfocus all elements
      if(this.unfocusOnHide) {
        var inputs = this.el.querySelectorAll('input, textarea');
        for(var i = 0; i < inputs.length; i++) {
          inputs[i].blur && inputs[i].blur();
        }
      }
    }
  });

})(ionic);
