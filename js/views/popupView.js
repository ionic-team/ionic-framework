(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.Popup = function(opts) {
    var _this = this;

    this.el = opts.el;
  };

  ionic.views.Popup.prototype = {
    setTitle: function(title) {
      var title = el.querySelector('.popup-title');
      title && title.innerHTML = title;
    },
    alert: function(message) {
      var _this = this;

      window.requestAnimationFrame(function() {
        _this.setTitle(message);
        _this.el.classList.add('active');
      });
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.remove('active');
    }
  };

})(ionic);
