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
      var item = e.target;
      var cl = item.classList;
      var content;
      var buttons;
      var buttonsWidth;

      window.requestAnimationFrame(function() {
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
          content.classList.add('slide-left');
        }
      });
    },
    _handleSwipeRight: function(e) {
      var item = e.target;

      window.requestAnimationFrame(function() {
        var cl = item.classList;

        if(cl.contains('list-item')) {
          content = item.querySelector('.list-item-content');
        } else if(cl.contains('list-item-content')) {
          content = item;
        }

        content.classList.remove('slide-left');
        content.style.right = 0;
        content.style.left = 0;
      });
    },
  };

})(ionic);
