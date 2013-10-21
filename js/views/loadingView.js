(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.Loading = function(opts) {
    var _this = this;

    this.el = opts.el;
    this._loadingBox = this.el.querySelector('.loading');
  };

  ionic.views.Loading.prototype = {
    show: function() {
      var _this = this;

      if(this._loadingBox) {
        window.requestAnimationFrame(function() {
          _this.el.classList.add('active');

          _this._loadingBox.style.marginLeft = (-_this._loadingBox.offsetWidth) / 2 + 'px';
          _this._loadingBox.style.marginTop = (-_this._loadingBox.offsetHeight) / 2 + 'px';
        });
      }
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.remove('active');
    }
  };

})(ionic);
