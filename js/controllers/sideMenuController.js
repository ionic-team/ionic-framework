(function(ionic) {
'use strict';

  /**
   * The SideMenuController is a controller with a left and/or right menu that
   * can be slid out and toggled. Seen on many an app.
   *
   * The right or left menu can be disabled or not used at all, if desired.
   */
  ionic.controllers.SideMenuController = ionic.controllers.ViewController.inherit({
    initialize: function(options) {
      var self = this;

      this.left = options.left;
      this.right = options.right;
      this.content = options.content;
      this.dragThresholdX = options.dragThresholdX || 10;
        
      this._rightShowing = false;
      this._leftShowing = false;
      this._isDragging = false;

      if(this.content) {
        this.content.onDrag = function(e) {
          self._handleDrag(e);
        };

        this.content.onEndDrag =function(e) {
          self._endDrag(e);
        };
      }
    },
    /**
     * Set the content view controller if not passed in the constructor options.
     * 
     * @param {object} content
     */
    setContent: function(content) {
      var self = this;

      this.content = content;

      this.content.onDrag = function(e) {
        self._handleDrag(e);
      };

      this.content.endDrag = function(e) {
        self._endDrag(e);
      };
    },

    /**
     * Toggle the left menu to open 100%
     */
    toggleLeft: function() {
      this.content.enableAnimation();
      var openAmount = this.getOpenAmount();
      if(openAmount > 0) {
        this.openPercentage(0);
      } else {
        this.openPercentage(100);
      }
    },

    /**
     * Toggle the right menu to open 100%
     */
    toggleRight: function() {
      this.content.enableAnimation();
      var openAmount = this.getOpenAmount();
      if(openAmount < 0) {
        this.openPercentage(0);
      } else {
        this.openPercentage(-100);
      }
    },

    /**
     * Close all menus.
     */
    close: function() {
      this.openPercentage(0);
    },

    /**
     * @return {float} The amount the side menu is open, either positive or negative for left (positive), or right (negative)
     */
    getOpenAmount: function() {
      return this.content && this.content.getTranslateX() || 0;
    },

    /**
     * @return {float} The ratio of open amount over menu width. For example, a
     * menu of width 100 open 50 pixels would be open 50% or a ratio of 0.5. Value is negative
     * for right menu.
     */
    getOpenRatio: function() {
      var amount = this.getOpenAmount();
      if(amount >= 0) {
        return amount / this.left.width;
      }
      return amount / this.right.width;
    },

    isOpen: function() {
      return this.getOpenRatio() == 1;
    },

    /**
     * @return {float} The percentage of open amount over menu width. For example, a
     * menu of width 100 open 50 pixels would be open 50%. Value is negative
     * for right menu.
     */
    getOpenPercentage: function() {
      return this.getOpenRatio() * 100;
    },

    /**
     * Open the menu with a given percentage amount.
     * @param {float} percentage The percentage (positive or negative for left/right) to open the menu.
     */
    openPercentage: function(percentage) {
      var p = percentage / 100;

      if(this.left && percentage >= 0) {
        this.openAmount(this.left.width * p);
      } else if(this.right && percentage < 0) {
        var maxRight = this.right.width;
        this.openAmount(this.right.width * p);
      }
    },

    /**
     * Open the menu the given pixel amount.
     * @param {float} amount the pixel amount to open the menu. Positive value for left menu,
     * negative value for right menu (only one menu will be visible at a time).
     */
    openAmount: function(amount) {
      var maxLeft = this.left && this.left.width || 0;
      var maxRight = this.right && this.right.width || 0;

      // Check if we can move to that side, depending if the left/right panel is enabled
      if((!(this.left && this.left.isEnabled) && amount > 0) || (!(this.right && this.right.isEnabled) && amount < 0)) {
        return;
      }

      if((this._leftShowing && amount > maxLeft) || (this._rightShowing && amount < -maxRight)) {
        return;
      }
      
      this.content.setTranslateX(amount);

      if(amount >= 0) {
        this._leftShowing = true;
        this._rightShowing = false;

        // Push the z-index of the right menu down
        this.right && this.right.pushDown && this.right.pushDown();
        // Bring the z-index of the left menu up
        this.left && this.left.bringUp && this.left.bringUp();
      } else {
        this._rightShowing = true;
        this._leftShowing = false;

        // Bring the z-index of the right menu up
        this.right && this.right.bringUp && this.right.bringUp();
        // Push the z-index of the left menu down
        this.left && this.left.pushDown && this.left.pushDown();
      }
    },

    /**
     * Given an event object, find the final resting position of this side
     * menu. For example, if the user "throws" the content to the right and 
     * releases the touch, the left menu should snap open (animated, of course).
     *
     * @param {Event} e the gesture event to use for snapping
     */
    snapToRest: function(e) {
      // We want to animate at the end of this
      this.content.enableAnimation();
      this._isDragging = false;

      // Check how much the panel is open after the drag, and
      // what the drag velocity is
      var ratio = this.getOpenRatio();

      if(ratio === 0)
        return;

      var velocityThreshold = 0.3;
      var velocityX = e.gesture.velocityX;
      var direction = e.gesture.direction;

      // Less than half, going left 
      //if(ratio > 0 && ratio < 0.5 && direction == 'left' && velocityX < velocityThreshold) {
      //this.openPercentage(0);
      //}

      // Going right, less than half, too slow (snap back)
      if(ratio > 0 && ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
        this.openPercentage(0);
      }

      // Going left, more than half, too slow (snap back)
      else if(ratio > 0.5 && direction == 'left' && velocityX < velocityThreshold) {
        this.openPercentage(100);
      }

      // Going left, less than half, too slow (snap back)
      else if(ratio < 0 && ratio > -0.5 && direction == 'left' && velocityX < velocityThreshold) {
        this.openPercentage(0);
      }

      // Going right, more than half, too slow (snap back)
      else if(ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
        this.openPercentage(-100);
      }
      
      // Going right, more than half, or quickly (snap open)
      else if(direction == 'right' && ratio >= 0 && (ratio >= 0.5 || velocityX > velocityThreshold)) {
        this.openPercentage(100);
      }
      
      // Going left, more than half, or quickly (span open)
      else if(direction == 'left' && ratio <= 0 && (ratio <= -0.5 || velocityX > velocityThreshold)) {
        this.openPercentage(-100);
      }
      
      // Snap back for safety
      else {
        this.openPercentage(0);
      }
    },

    // End a drag with the given event
    _endDrag: function(e) {
      if(this._isDragging) {
        this.snapToRest(e);
      }
      this._startX = null;
      this._lastX = null;
      this._offsetX = null;
    },

    // Handle a drag event
    _handleDrag: function(e) {
      // If we don't have start coords, grab and store them
      if(!this._startX) {
        this._startX = e.gesture.touches[0].pageX;
        this._lastX = this._startX;
      } else {
        // Grab the current tap coords
        this._lastX = e.gesture.touches[0].pageX;
      }

      // Calculate difference from the tap points
      if(!this._isDragging && Math.abs(this._lastX - this._startX) > this.dragThresholdX) {
        // if the difference is greater than threshold, start dragging using the current
        // point as the starting point
        this._startX = this._lastX;

        this._isDragging = true;
        // Initialize dragging
        this.content.disableAnimation();
        this._offsetX = this.getOpenAmount();
      }

      if(this._isDragging) {
        this.openAmount(this._offsetX + (this._lastX - this._startX));
      }
    }
  });

})(ionic);
