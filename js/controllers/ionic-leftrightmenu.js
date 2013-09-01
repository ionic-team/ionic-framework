/**
 * The LeftRightMenuViewController makes it easy to have an interface
 * with two hidden menus: one on the left, and one on the right.
 *
 * The main content supports dragging to show either panel, or the panel can be
 * show/hidden through buttons elsewhere in the app.
 *
 * Either panel can be disabled based on the context in the app.
 */
(function(window, document, ion) {
  ion.controllers = ion.controllers || {};

  ion.controllers.LeftRightMenuViewController = function(options) {
    var _this = this;

    this.animateClass = options.animateClass;
    this.left = options.left;
    this.leftWidth = options.leftWidth;
    this.right = options.right;
    this.rightWidth = options.rightWidth;
    this.center = options.center;
    this.isLeftEnabled = options.isLeftEnabled == undefined ? true : options.isLeftEnabled;
    this.isRightEnabled = options.isRightEnabled == undefined ? true : options.isRightEnabled;
      
    this._rightShowing = false;
    this._leftShowing = false;


    // Bind release and drag listeners
    window.ion.onGesture('release', function(e) {
      _this._endDrag(e);
    }, this.center);

    window.ion.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.center);
  };

  ion.controllers.LeftRightMenuViewController.prototype = {
    setIsLeftEnabled: function(isLeftEnabled) {
      this.isLeftEnabled = isLeftEnabled;
    },
    setIsRightEnabled: function(isRightEnabled) {
      this.isRightEnabled = isRightEnabled;
    },
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
      var r = /translate3d\((-?\d+)px/;
      var d = r.exec(this.center.style.webkitTransform);

      if(d && d.length > 0) {
        return parseInt(d[1]);
      }
      return 0;
    },
    getOpenRatio: function() {
      var amount = this.getOpenAmount();
      if(amount >= 0) {
        return amount / this.leftWidth;
      }
      return amount / this.rightWidth;
    },
    openPercentage: function(percentage) {
      var p = percentage / 100;
      var maxLeft = this.leftWidth;
      var maxRight = this.rightWidth;
      if(percentage >= 0) {
        this.openAmount(maxLeft * p);
      } else {
        this.openAmount(maxRight * p);
      }
    },
    openAmount: function(amount) {
      var maxLeft = this.leftWidth;
      var maxRight = this.rightWidth;

      // Check if we can move to that side, depending if the left/right panel is enabled
      if((!this.isLeftEnabled && amount > 0) || (!this.isRightEnabled && amount < 0)) {
        return;
      }

      if((this._leftShowing && amount > maxLeft) || (this._rightShowing && amount < -maxRight)) {
        return;
      }
      
      this.center.style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';

      if(amount >= 0) {
        this._leftShowing = true;
        this._rightShowing = false;

        if(this.isRightEnabled) {
          this.right.style.zIndex = -1;
        }
        if(this.isLeftEnabled) {
          this.left.style.zIndex = 0;
        }
      } else {
        this._rightShowing = true;
        this._leftShowing = false;
        if(this.isRightEnabled) {
          this.right.style.zIndex = 0;
        }
        if(this.isLeftEnabled) {
          this.left.style.zIndex = -1;
        }
      }
    },
    snapToRest: function(e) {
      // We want to animate at the end of this
      this.center.classList.add(this.animateClass);
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
      this.center.classList.remove(this.animateClass);
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

})(this, document, ion = this.ion || {});
