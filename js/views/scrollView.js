(function(ionic) {
'use strict';

  ionic.views.Scroll = function(opts) {
    var _this = this;

    // Extend the options with our defaults
    ionic.Utils.extend(opts, {
      decelerationRate: ionic.views.Scroll.prototype.DECEL_RATE_NORMAL
    });

    this.el = opts.el;
    this.decelerationRate = opts.decelerationRate

    // Listen for drag and release events
    window.ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.el);
    window.ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);
  };

  ionic.views.Scroll.prototype = {
    DECEL_RATE_NORMAL: 0.998,
    DECEL_RATE_FAST: 0.99,

    _initDrag: function() {
      this._isDragging = false;
      this._drag = null;
    },

    /**
     * Initialize a drag by grabbing the content area to drag, and any other
     * info we might need for the dragging.
     */
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      this.el.classList.remove('scroll-scrolling');

      var scrollTop = parseFloat(this.el.scrollTop);

      this._drag = {
        startY: scrollTop
      };
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this;

      window.requestAnimationFrame(function() {
        var content;

        // We really aren't dragging
        if(!_this._drag) {
          _this._startDrag(e);
        }
        console.log('At scroll top', _this.el.scrollTop, e.gesture.deltaY);

        _this.el.style.webkitTransform = 'translate3d(0,' + e.gesture.deltaY + 'px, 0)';
      });
    },
    _handleEndDrag: function(e) {
      var _this = this;

      window.requestAnimationFrame(function() {
      
        // We didn't have a drag, so just init and leave
        if(!_this._drag) {
          _this._initDrag();
          return;
        }

        _this._initDrag();
      });
    }
  };

})(ionic);
