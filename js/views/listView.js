(function(ionic) {

  ionic.views.List = function(opts) {
    var _this = this;

    this.el = opts.el;

    this.dragThresholdX = 10;
      
    this._initDrag();

    window.ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.el);
    window.ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);

    /*
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
    */
  };

  ionic.views.List.prototype = {
    _initDrag: function() {
      this._offsetX = 0;
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

      if(!content) {
        return;
      }

      content.classList.remove('list-item-sliding');

      // Grab the buttons
      buttons = content.parentNode.querySelector('.list-item-buttons');
      if(!buttons) {
        return;
      }
        
      buttonsWidth = buttons.offsetWidth;

      this._currentDrag = {
        buttonsWidth: buttonsWidth,
        content: content
      };
    },
    _handleEndDrag: function(e) {
      var _this = this;
      
      // If we are currently dragging, we want to snap back into place
      if(this._currentDrag) {

        // The final resting point X will be the width of the exposed buttons
        var restingPoint = -this._currentDrag.buttonsWidth;

        // Check if the drag didn't clear the buttons and we aren't moving fast enough to swipe open
        if(e.gesture.deltaX > -this._currentDrag.buttonsWidth) {
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

      } else {
        this._initDrag();
      }
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this, content, buttons;

      if(!this._currentDrag) {
        this._startDrag(e);
      }

      window.requestAnimationFrame(function() {

        if(!_this._currentDrag) {
          return;
        }

        // Calculate difference from the tap points
        if(!_this._isDragging && Math.abs(e.gesture.deltaX) > _this.dragThresholdX) {
          _this._isDragging = true;

          // Grab the starting X point for this item
          _this._offsetX = parseFloat(_this._currentDrag.content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
        }

        if(_this._isDragging) {

          // Grab the new X point, capping it at zero

          var newX = Math.min(0, _this._offsetX + e.gesture.deltaX);
          if(newX < -buttonsWidth && !_this._deltaSlowX) {
            _this._deltaSlowX = e.gesture.deltaX;
          }
          if(newX < -buttonsWidth) {
            newX = Math.min(_this._deltaSlowX, _this._deltaSlowX + (((e.gesture.deltaX - _this._deltaSlowX) * 0.4)));
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
