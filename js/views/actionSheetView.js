(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.ActionSheet = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
    },
    show: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.add('active');
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;
      this.el.classList.remove('active');
    }
  });

})(ionic);
