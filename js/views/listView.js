(function(ionic) {

  ionic.views.List = function(opts) {
    var _this = this;

    this.el = opts.el;

    window.ionic.onGesture('swipeleft', function(e) {
      _this._handleSwipeLeft(e);
    }, this.el);

    window.ionic.onGesture('swiperight', function(e) {
      _this._handleSwipeRight(e);
    }, this.el);
  };

  ionic.views.List.prototype = {
    _handleSwipeLeft: function(e) {

      window.requestAnimationFrame(function() {
        var item = e.target,
          cl = item.classList,
          content, buttons, buttonsWidth;

        // Grab the content item
        if(cl.contains('list-item')) {
          content = item.querySelector('.list-item-content');
        } else if(cl.contains('list-item-content')) {
          content = item;
        }

        // Grab the buttons
        buttons = content.parentNode.querySelector('.list-item-buttons');
        if(buttons) {
          buttonsWidth = buttons.offsetWidth;

          // Slide the content over left by the button width
          content.style.right = buttonsWidth + 'px';
          content.style.left = -buttonsWidth + 'px';
        }
      });
    },
    _handleSwipeRight: function(e) {

      window.requestAnimationFrame(function() {
        var item = e.target,
          cl = item.classList;

        if(cl.contains('list-item')) {
          content = item.querySelector('.list-item-content');
        } else if(cl.contains('list-item-content')) {
          content = item;
        }

        content.style.right = 0;
        content.style.left = 0;
      });
    },
  };

})(ionic);
