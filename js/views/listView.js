(function(ionic) {

  ionic.views.List = function(opts) {
    var _this = this;

    this.el = opts.el;

    window.ionic.onGesture('swipeleft', function(e) {
      _this._handleSwipeLeft(e);
      e.gesture.stopDetect();
      return false;
    }, this.el);

    window.ionic.onGesture('swiperight', function(e) {
      _this._handleSwipeRight(e);
      e.gesture.stopDetect();
      return false;
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

        if(!content) {
          return;
        }

        // Grab the buttons
        buttons = content.parentNode.querySelector('.list-item-buttons');
        if(buttons) {
          buttonsWidth = buttons.offsetWidth;

          // Slide the content over left by the button width
          content.style.left = -buttonsWidth + 'px';
        }
      });
    },
    _handleSwipeRight: function(e) {

      window.requestAnimationFrame(function() {
        var item = e.target,
          cl = item.classList,
          content;

        if(cl.contains('list-item')) {
          content = item.querySelector('.list-item-content');
        } else if(cl.contains('list-item-content')) {
          content = item;
        }

        // This item didn't have content
        if(!content) {
          return;
        }

        content.style.left = 0;
      });
    },
  };

})(ionic);
