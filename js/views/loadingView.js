(function(ionic) {
'use strict';
  /**
   * Loading
   *
   * The Loading is an overlay that can be used to indicate
   * activity while blocking user interaction.
   */
  ionic.views.Loading = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      this.el = opts.el;

      this.maxWidth = opts.maxWidth || 200;

      this.showDelay = opts.showDelay || 0;

      this._loadingBox = this.el.querySelector('.loading');
    },
    show: function() {
      var _this = this;

      if(this._loadingBox) {
        var lb = _this._loadingBox;

        var width = Math.min(_this.maxWidth, Math.max(window.outerWidth - 40, lb.offsetWidth));

        lb.style.width = width + 'px';

        lb.style.marginLeft = (-lb.offsetWidth) / 2 + 'px';
        lb.style.marginTop = (-lb.offsetHeight) / 2 + 'px';

        // Wait 'showDelay' ms before showing the loading screen
        this._showDelayTimeout = window.setTimeout(function() {
          _this.el.classList.add('active');
        }, _this.showDelay);
      }
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      // Prevent unnecessary 'show' after 'hide' has already been called
      window.clearTimeout(this._showDelayTimeout);

      this.el.classList.remove('active');
    }
  });

})(ionic);
