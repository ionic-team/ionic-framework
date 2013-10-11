(function(ionic) {

  /**
   * The ListView handles a list of items. It will process drag animations, edit mode,
   * and other operations that are common on mobile lists or table views.
   */
  ionic.views.List = function(opts) {
    var _this = this;

    this.el = opts.el;

    // The amount of dragging required to start sliding the element over (in pixels)
    this.dragThresholdX = opts.dragThresholdX || 10;
      
    // Start the drag states
    this._initDrag();

    // Listen for drag and release events
    window.ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.el);
    window.ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);
  };

  ionic.views.List.prototype = {
    _initDrag: function() {
      this._isDragging = false;
      this._currentDrag = null;
    },
    _startDrag: function(e) {
      this._isDragging = false;

      // Grab the content item
      if(e.target.classList.contains('list-item')) {
        content = e.target.querySelector('.list-item-content');
      } else if(e.target.classList.contains('list-item-content')) {
        content = e.target;
      }

      // If we don't have a content area as one of our children (or ourselves), skip
      if(!content) {
        return;
      }

      // Make sure we aren't animating as we slide
      content.classList.remove('list-item-sliding');

      // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
      var offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

      // Grab the buttons
      buttons = content.parentNode.querySelector('.list-item-buttons');
      if(!buttons) {
        return;
      }
        
      buttonsWidth = buttons.offsetWidth;

      this._currentDrag = {
        buttonsWidth: buttonsWidth,
        content: content,
        startOffsetX: offsetX
      };
    },
    _handleEndDrag: function(e) {
      var _this = this;
      
      if(!this._currentDrag) {
        this._initDrag();
        return;
      }

      // If we are currently dragging, we want to snap back into place

      // The final resting point X will be the width of the exposed buttons
      var restingPoint = -this._currentDrag.buttonsWidth;

      // Check if the drag didn't clear the buttons mid-point 
      // and we aren't moving fast enough to swipe open
      if(e.gesture.deltaX > -(this._currentDrag.buttonsWidth/2)) {

        // If we are going left but too slow, or going right, go back to resting
        if(e.gesture.direction == "left" && Math.abs(e.gesture.velocityX) < 0.3) {
          restingPoint = 0;
        } else if(e.gesture.direction == "right") {
          restingPoint = 0;
        }

      }

      var content = this._currentDrag.content;

      var onRestingAnimationEnd = function(e) {
        if(e.propertyName == '-webkit-transform') {
          content.classList.remove('list-item-sliding');
        }
        e.target.removeEventListener('webkitTransitionEnd', onRestingAnimationEnd);
      }

      window.requestAnimationFrame(function() {
        var currentX = parseFloat(_this._currentDrag.content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
        if(currentX !== restingPoint) {
          _this._currentDrag.content.classList.add('list-item-sliding');
          _this._currentDrag.content.addEventListener('webkitTransitionEnd', onRestingAnimationEnd);
        }
        _this._currentDrag.content.style.webkitTransform = 'translate3d(' + restingPoint + 'px, 0, 0)';
        _this._initDrag();
      });
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this, content, buttons;

      window.requestAnimationFrame(function() {

        if(!_this._currentDrag) {
          _this._startDrag(e);
        }

        // We really aren't dragging
        if(!_this._currentDrag) {
          return;
        }

        // Check if we should start dragging. Check if we've dragged past the threshold,
        // or we are starting from the open state.
        if(!_this._isDragging &&
            ((Math.abs(e.gesture.deltaX) > _this.dragThresholdX) ||
            (Math.abs(_this._currentDrag.startOffsetX) > 0)))
        {
          _this._isDragging = true;
        }

        if(_this._isDragging) {

          // Grab the new X point, capping it at zero
          var newX = Math.min(0, _this._currentDrag.startOffsetX + e.gesture.deltaX);

          // If the new X position is past the buttons, we need to slow down the drag (rubber band style)
          if(newX < -buttonsWidth) {
            // Calculate the new X position, capped at the top of the buttons
            newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
          }

          console.log(newX);
          
          _this._currentDrag.content.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
        }
      });
    },


    _handleSwipeLeft: function(e) {

      window.requestAnimationFrame(function() {
        var item = e.target,
          cl = item.classList,
          content, buttons, buttonsWidth;


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
