/**
 * The SlideBox is a swipeable, slidable, slideshowable box. Think of any image gallery
 * or iOS "dot" pager gallery, or maybe a carousel.
 *
 * Each screen fills the full width and height of the viewport, and screens can
 * be swiped between, or set to automatically transition.
 */
(function(ionic) {
'use strict';

  ionic.views.SlideBox = function(opts) {
    var _this = this;

    this.el = opts.el;

    this.dragThresholdX = opts.dragThresholdX || 10;

    // Listen for drag and release events
    window.ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.el);
    window.ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);
  };

  ionic.views.SlideBox.prototype = {
    _initDrag: function() {
      this._isDragging = false;
      this._currentDrag = null;
    },
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      // Make sure to grab the element we will slide as our target
      content = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'slide-box');
      if(!content) {
        return;
      }

      // Disable transitions during drag
      content.classList.remove('slide-box-animating');

      // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
      offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

      this._currentDrag = {
        content: content,
        startOffsetX: offsetX
      };
    },

    _handleEndDrag: function(e) {
      var _this = this;

      var finalOffsetX, content, ratio, slideWidth, totalWidth, offsetX;
      
      // We didn't have a drag, so just init and leave
      if(!this._currentDrag) {
        this._initDrag();
        return;
      }

      // Snap to the correct spot

      content = this._currentDrag.content;

      // Enable transition duration
      content.classList.add('slide-box-animating');

      offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      slideWidth = content.offsetWidth;
      totalWidth = content.offsetWidth * content.children.length;

      // Calculate how far in this slide we've dragged
      ratio = (offsetX % slideWidth) / slideWidth;

      if(ratio >= 0) {
        // Anything greater than zero is too far left
        finalOffsetX = 0;
      } else if(ratio >= -0.5) {
        finalOffsetX = Math.max(0, Math.floor(Math.abs(offsetX) / slideWidth) * slideWidth);
      } else {
        // Sliiide to the right
        finalOffsetX = Math.min(totalWidth - slideWidth, Math.ceil(Math.abs(offsetX) / slideWidth) * slideWidth);
      }

      // Negative offsetX to slide correctly
      content.style.webkitTransform = 'translate3d(' + -finalOffsetX + 'px, 0, 0)';

      this._initDrag();
    },
    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this;
      window.requestAnimationFrame(function() {
        // We really aren't dragging
        if(!_this._currentDrag) {
          _this._startDrag(e);
        }

        // Check if we should start dragging. Check if we've dragged past the threshold,
        // or we are starting from the open state.
        if(!_this._isDragging &&
            ((Math.abs(e.gesture.deltaX) > _this.dragThresholdX) || (Math.abs(_this._currentDrag.startOffsetX) > 0)))
        {
          _this._isDragging = true;
        }

        if(_this._isDragging) {
          // Grab the new X point, capping it at zero
          var newX = Math.min(_this._currentDrag.content.offsetWidth, _this._currentDrag.startOffsetX + e.gesture.deltaX);


          _this._currentDrag.content.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
        }
      });
    }
  };

})(window.ionic);
