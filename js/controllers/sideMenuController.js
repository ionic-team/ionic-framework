
(function(ionic) {

  ionic.controllers.SideMenuController = function(options) {
    var self = this;

    self.left = options.left;
    self.right = options.right;
    self.content = options.content;
      
    self._rightShowing = false;
    self._leftShowing = false;

    this.content.onDrag = function(e) {
      self._handleDrag(e);
    };

    this.content.endDrag = function(e) {
      self._endDrag(e);
    };

    /*
    // Bind release and drag listeners
    window.ion.onGesture('release', function(e) {
      self._endDrag(e);
    }, self.center);

    window.ion.onGesture('drag', function(e) {
      self._handleDrag(e);
    }, self.center);
    */
  };

  ionic.controllers.SideMenuController.prototype = {
    toggleLeft: function() {
      var openAmount = this.getOpenAmount();
      if(openAmount > 0) {
        this.openPercentage(0);
      } else {
        this.openPercentage(100);
      }
    },
    toggleRight: function() {
      var openAmount = this.getOpenAmount();
      if(openAmount < 0) {
        this.openPercentage(0);
      } else {
        this.openPercentage(-100);
      }
    },
    getOpenAmount: function() {
      return this.content.getTranslateX() || 0;
    },
    getOpenRatio: function() {
      var amount = this.getOpenAmount();
      if(amount >= 0) {
        return amount / this.left.width;
      }
      return amount / this.right.width;
    },
    getOpenPercentage: function() {
      return this.getOpenRatio() * 100;
    },
    openPercentage: function(percentage) {
      var p = percentage / 100;
      var maxLeft = this.left.width;
      var maxRight = this.right.width;
      if(percentage >= 0) {
        this.openAmount(maxLeft * p);
      } else {
        this.openAmount(maxRight * p);
      }
    },
    openAmount: function(amount) {
      var maxLeft = this.left.width;
      var maxRight = this.right.width;

      // Check if we can move to that side, depending if the left/right panel is enabled
      if((!this.left.isEnabled && amount > 0) || (!this.right.isEnabled && amount < 0)) {
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
        this.right.pushDown();
        // Bring the z-index of the left menu up
        this.left.bringUp();
      } else {
        this._rightShowing = true;
        this._leftShowing = false;

        // Bring the z-index of the right menu up
        this.right.bringUp();
        // Push the z-index of the left menu down
        this.left.pushDown();
      }
    },
    snapToRest: function(e) {
      // We want to animate at the end of this
      this.content.enableAnimation();
      this._isDragging = false;

      // Check how much the panel is open after the drag, and
      // what the drag velocity is
      var ratio = this.getOpenRatio();

      if(ratio == 0)
        return;

      var velocityThreshold = 0.3;
      var velocityX = e.gesture.velocityX
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
    _endDrag: function(e) {
      this.snapToRest(e);
    },
    _initDrag: function(e) {
      this.content.disableAnimation();
      this._isDragging = true;
      this._startX = 0;
      this._offsetX = 0;
      this._lastX = 0;
    },
    _handleDrag: function(e) {
      if(!this._isDragging) {
        this._initDrag(e);

        this._startX = e.gesture.touches[0].pageX;
        this._lastX = this._startX;

        this._offsetX = this.getOpenAmount();
      }
      //console.log('Dragging page', this._startX, this._lastX, this._offsetX, e);
      var newX = this._offsetX + (this._lastX - this._startX);

      this.openAmount(newX);

      this._lastX = e.gesture.touches[0].pageX;
    }
  };

})(ionic);
