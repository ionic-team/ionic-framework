(function(ionic) {
'use strict';

  ionic.views.Toggle = ionic.views.View.inherit({
    initialize: function(opts) {
      var self = this;

      this.el = opts.el;
      this.checkbox = opts.checkbox;
      this.track = opts.track;
      this.handle = opts.handle;
      this.openPercent = -1;
      this.onChange = opts.onChange || function() {};

      this.triggerThreshold = opts.triggerThreshold || 20;

      this.dragStartHandler = function(e) {
        self.dragStart(e);
      };
      this.dragHandler = function(e) {
        self.drag(e);
      };
      this.holdHandler = function(e) {
        self.hold(e);
      };
      this.releaseHandler = function(e) {
        self.release(e);
      };

      this.dragStartGesture = ionic.onGesture('dragstart', this.dragStartHandler, this.el);
      this.dragGesture = ionic.onGesture('drag', this.dragHandler, this.el);
      this.dragHoldGesture = ionic.onGesture('hold', this.holdHandler, this.el);
      this.dragReleaseGesture = ionic.onGesture('release', this.releaseHandler, this.el);
    },

    destroy: function() {
      ionic.offGesture(this.dragStartGesture, 'dragstart', this.dragStartGesture);
      ionic.offGesture(this.dragGesture, 'drag', this.dragGesture);
      ionic.offGesture(this.dragHoldGesture, 'hold', this.holdHandler);
      ionic.offGesture(this.dragReleaseGesture, 'release', this.releaseHandler);
    },

    tap: function() {
      if(this.el.getAttribute('disabled') !== 'disabled') {
        this.val( !this.checkbox.checked );
      }
    },

    dragStart: function(e) {
      if(this.checkbox.disabled) return;

      this._dragInfo = {
        width: this.el.offsetWidth,
        left: this.el.offsetLeft,
        right: this.el.offsetLeft + this.el.offsetWidth,
        triggerX: this.el.offsetWidth / 2,
        initialState: this.checkbox.checked
      };

      // Stop any parent dragging
      e.gesture.srcEvent.preventDefault();

      // Trigger hold styles
      this.hold(e);
    },

    drag: function(e) {
      var self = this;
      if(!this._dragInfo) { return; }

      // Stop any parent dragging
      e.gesture.srcEvent.preventDefault();

      ionic.requestAnimationFrame(function () {
        if (!self._dragInfo) { return; }

        var px = e.gesture.touches[0].pageX - self._dragInfo.left;
        var mx = self._dragInfo.width - self.triggerThreshold;

        // The initial state was on, so "tend towards" on
        if(self._dragInfo.initialState) {
          if(px < self.triggerThreshold) {
            self.setOpenPercent(0);
          } else if(px > self._dragInfo.triggerX) {
            self.setOpenPercent(100);
          }
        } else {
          // The initial state was off, so "tend towards" off
          if(px < self._dragInfo.triggerX) {
            self.setOpenPercent(0);
          } else if(px > mx) {
            self.setOpenPercent(100);
          }
        }
      });
    },

    endDrag: function() {
      this._dragInfo = null;
    },

    hold: function() {
      this.el.classList.add('dragging');
    },
    release: function(e) {
      this.el.classList.remove('dragging');
      this.endDrag(e);
    },


    setOpenPercent: function(openPercent) {
      // only make a change if the new open percent has changed
      if(this.openPercent < 0 || (openPercent < (this.openPercent - 3) || openPercent > (this.openPercent + 3) ) ) {
        this.openPercent = openPercent;

        if(openPercent === 0) {
          this.val(false);
        } else if(openPercent === 100) {
          this.val(true);
        } else {
          var openPixel = Math.round( (openPercent / 100) * this.track.offsetWidth - (this.handle.offsetWidth) );
          openPixel = (openPixel < 1 ? 0 : openPixel);
          this.handle.style[ionic.CSS.TRANSFORM] = 'translate3d(' + openPixel + 'px,0,0)';
        }
      }
    },

    val: function(value) {
      if(value === true || value === false) {
        if(this.handle.style[ionic.CSS.TRANSFORM] !== "") {
          this.handle.style[ionic.CSS.TRANSFORM] = "";
        }
        this.checkbox.checked = value;
        this.openPercent = (value ? 100 : 0);
        this.onChange && this.onChange();
      }
      return this.checkbox.checked;
    }

  });

})(ionic);
