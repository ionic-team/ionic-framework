(function(ionic) {
'use strict';

  var ITEM_CLASS = 'item';
  var ITEM_CONTENT_CLASS = 'item-content';
  var ITEM_SLIDING_CLASS = 'item-sliding';
  var ITEM_OPTIONS_CLASS = 'item-options';
  var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
  var ITEM_REORDERING_CLASS = 'item-reordering';
  var ITEM_REORDER_BTN_CLASS = 'item-reorder';

  var DragOp = function() {};
  DragOp.prototype = {
    start: function(e) {
    },
    drag: function(e) {
    },
    end: function(e) {
    },
    isSameItem: function(item) {
      return false;
    }
  };

  var SlideDrag = function(opts) {
    this.dragThresholdX = opts.dragThresholdX || 10;
    this.el = opts.el;
    this.item = opts.item;
    this.canSwipe = opts.canSwipe;
  };

  SlideDrag.prototype = new DragOp();

  SlideDrag.prototype.start = function(e) {
    var content, buttons, offsetX, buttonsWidth;

    if (!this.canSwipe()) {
      return;
    }

    if (e.target.classList.contains(ITEM_CONTENT_CLASS)) {
      content = e.target;
    } else if (e.target.classList.contains(ITEM_CLASS)) {
      content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
    } else {
      content = ionic.DomUtil.getParentWithClass(e.target, ITEM_CONTENT_CLASS);
    }

    // If we don't have a content area as one of our children (or ourselves), skip
    if (!content) {
      return;
    }

    // Make sure we aren't animating as we slide
    content.classList.remove(ITEM_SLIDING_CLASS);

    // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
    offsetX = parseFloat(content.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]) || 0;

    // Grab the buttons
    buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
    if (!buttons) {
      return;
    }
    buttons.classList.remove('invisible');

    buttonsWidth = buttons.offsetWidth;

    this._currentDrag = {
      buttons: buttons,
      buttonsWidth: buttonsWidth,
      content: content,
      startOffsetX: offsetX
    };
  };

  /**
   * Check if this is the same item that was previously dragged.
   */
  SlideDrag.prototype.isSameItem = function(op) {
    if (op._lastDrag && this._currentDrag) {
      return this._currentDrag.content == op._lastDrag.content;
    }
    return false;
  };

  SlideDrag.prototype.clean = function(isInstant) {
    var lastDrag = this._lastDrag;

    if (!lastDrag || !lastDrag.content) return;

    lastDrag.content.style[ionic.CSS.TRANSITION] = '';
    lastDrag.content.style[ionic.CSS.TRANSFORM] = '';
    if (isInstant) {
      lastDrag.content.style[ionic.CSS.TRANSITION] = 'none';
      makeInvisible();
      ionic.requestAnimationFrame(function() {
        lastDrag.content.style[ionic.CSS.TRANSITION] = '';
      });
    } else {
      ionic.requestAnimationFrame(function() {
        setTimeout(makeInvisible, 250);
      });
    }
    function makeInvisible() {
      lastDrag.buttons && lastDrag.buttons.classList.add('invisible');
    }
  };

  SlideDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
    var buttonsWidth;

    // We really aren't dragging
    if (!this._currentDrag) {
      return;
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if (!this._isDragging &&
        ((Math.abs(e.gesture.deltaX) > this.dragThresholdX) ||
        (Math.abs(this._currentDrag.startOffsetX) > 0))) {
      this._isDragging = true;
    }

    if (this._isDragging) {
      buttonsWidth = this._currentDrag.buttonsWidth;

      // Grab the new X point, capping it at zero
      var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);

      // If the new X position is past the buttons, we need to slow down the drag (rubber band style)
      if (newX < -buttonsWidth) {
        // Calculate the new X position, capped at the top of the buttons
        newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
      }

      this._currentDrag.content.$$ionicOptionsOpen = newX !== 0;

      this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
      this._currentDrag.content.style[ionic.CSS.TRANSITION] = 'none';
    }
  });

  SlideDrag.prototype.end = function(e, doneCallback) {
    var self = this;

    // There is no drag, just end immediately
    if (!self._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    // If we are currently dragging, we want to snap back into place
    // The final resting point X will be the width of the exposed buttons
    var restingPoint = -self._currentDrag.buttonsWidth;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    if (e.gesture.deltaX > -(self._currentDrag.buttonsWidth / 2)) {

      // If we are going left but too slow, or going right, go back to resting
      if (e.gesture.direction == "left" && Math.abs(e.gesture.velocityX) < 0.3) {
        restingPoint = 0;

      } else if (e.gesture.direction == "right") {
        restingPoint = 0;
      }

    }

    ionic.requestAnimationFrame(function() {
      if (restingPoint === 0) {
        self._currentDrag.content.style[ionic.CSS.TRANSFORM] = '';
        var buttons = self._currentDrag.buttons;
        setTimeout(function() {
          buttons && buttons.classList.add('invisible');
        }, 250);
      } else {
        self._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + restingPoint + 'px,0,0)';
      }
      self._currentDrag.content.style[ionic.CSS.TRANSITION] = '';


      // Kill the current drag
      if (!self._lastDrag) {
        self._lastDrag = {};
      }
      ionic.extend(self._lastDrag, self._currentDrag);
      if (self._currentDrag) {
        self._currentDrag.buttons = null;
        self._currentDrag.content = null;
      }
      self._currentDrag = null;

      // We are done, notify caller
      doneCallback && doneCallback();
    });
  };

  var ReorderDrag = function(opts) {
    var self = this;

    self.dragThresholdY = opts.dragThresholdY || 0;
    self.onReorder = opts.onReorder;
    self.listEl = opts.listEl;
    self.el = self.item = opts.el;
    self.scrollEl = opts.scrollEl;
    self.scrollView = opts.scrollView;
    // Get the True Top of the list el http://www.quirksmode.org/js/findpos.html
    self.listElTrueTop = 0;
    if (self.listEl.offsetParent) {
      var obj = self.listEl;
      do {
        self.listElTrueTop += obj.offsetTop;
        obj = obj.offsetParent;
      } while (obj);
    }
  };

  ReorderDrag.prototype = new DragOp();

  ReorderDrag.prototype._moveElement = function(e) {
    var y = e.gesture.center.pageY +
      this.scrollView.getValues().top -
      (this._currentDrag.elementHeight / 2) -
      this.listElTrueTop;
    this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + y + 'px, 0)';
  };

  ReorderDrag.prototype.deregister = function() {
    this.listEl = this.el = this.scrollEl = this.scrollView = null;
  };

  ReorderDrag.prototype.start = function(e) {
    var content;

    var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
    var elementHeight = this.el.scrollHeight;
    var placeholder = this.el.cloneNode(true);

    placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);

    this.el.parentNode.insertBefore(placeholder, this.el);
    this.el.classList.add(ITEM_REORDERING_CLASS);

    this._currentDrag = {
      elementHeight: elementHeight,
      startIndex: startIndex,
      placeholder: placeholder,
      scrollHeight: scroll,
      list: placeholder.parentNode
    };

    this._moveElement(e);
  };

  ReorderDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
    // We really aren't dragging
    var self = this;
    if (!this._currentDrag) {
      return;
    }

    var scrollY = 0;
    var pageY = e.gesture.center.pageY;
    var offset = this.listElTrueTop;

    //If we have a scrollView, check scroll boundaries for dragged element and scroll if necessary
    if (this.scrollView) {

      var container = this.scrollView.__container;
      scrollY = this.scrollView.getValues().top;

      var containerTop = container.offsetTop;
      var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight / 2;
      var pixelsPastBottom = pageY + this._currentDrag.elementHeight / 2 - containerTop - container.offsetHeight;

      if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
        this.scrollView.scrollBy(null, -pixelsPastTop);
        //Trigger another drag so the scrolling keeps going
        ionic.requestAnimationFrame(function() {
          self.drag(e);
        });
      }
      if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
        if (scrollY < this.scrollView.getScrollMax().top) {
          this.scrollView.scrollBy(null, pixelsPastBottom);
          //Trigger another drag so the scrolling keeps going
          ionic.requestAnimationFrame(function() {
            self.drag(e);
          });
        }
      }
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if (!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
      this._isDragging = true;
    }

    if (this._isDragging) {
      this._moveElement(e);

      this._currentDrag.currentY = scrollY + pageY - offset;

      // this._reorderItems();
    }
  });

  // When an item is dragged, we need to reorder any items for sorting purposes
  ReorderDrag.prototype._getReorderIndex = function() {
    var self = this;

    var placeholder = self._currentDrag.placeholder;
    var siblings = Array.prototype.slice.call(self._currentDrag.placeholder.parentNode.children)
      .filter(function(el) {
        return el.nodeName === self.el.nodeName && el !== self.el;
      });

    var dragOffsetTop = self._currentDrag.currentY;
    var el;
    for (var i = 0, len = siblings.length; i < len; i++) {
      el = siblings[i];
      if (i === len - 1) {
        if (dragOffsetTop > el.offsetTop) {
          return i;
        }
      } else if (i === 0) {
        if (dragOffsetTop < el.offsetTop + el.offsetHeight) {
          return i;
        }
      } else if (dragOffsetTop > el.offsetTop - el.offsetHeight / 2 &&
                 dragOffsetTop < el.offsetTop + el.offsetHeight) {
        return i;
      }
    }
    return self._currentDrag.startIndex;
  };

  ReorderDrag.prototype.end = function(e, doneCallback) {
    if (!this._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    var placeholder = this._currentDrag.placeholder;
    var finalIndex = this._getReorderIndex();

    // Reposition the element
    this.el.classList.remove(ITEM_REORDERING_CLASS);
    this.el.style[ionic.CSS.TRANSFORM] = '';

    placeholder.parentNode.insertBefore(this.el, placeholder);
    placeholder.parentNode.removeChild(placeholder);

    this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalIndex);

    this._currentDrag = {
      placeholder: null,
      content: null
    };
    this._currentDrag = null;
    doneCallback && doneCallback();
  };



  /**
   * The ListView handles a list of items. It will process drag animations, edit mode,
   * and other operations that are common on mobile lists or table views.
   */
  ionic.views.ListView = ionic.views.View.inherit({
    initialize: function(opts) {
      var self = this;

      opts = ionic.extend({
        onReorder: function(el, oldIndex, newIndex) {},
        virtualRemoveThreshold: -200,
        virtualAddThreshold: 200,
        canSwipe: function() {
          return true;
        }
      }, opts);

      ionic.extend(self, opts);

      if (!self.itemHeight && self.listEl) {
        self.itemHeight = self.listEl.children[0] && parseInt(self.listEl.children[0].style.height, 10);
      }

      self.onRefresh = opts.onRefresh || function() {};
      self.onRefreshOpening = opts.onRefreshOpening || function() {};
      self.onRefreshHolding = opts.onRefreshHolding || function() {};

      var gestureOpts = {};
      // don't prevent native scrolling
      if (ionic.DomUtil.getParentOrSelfWithClass(self.el,'overflow-scroll')) {
        gestureOpts.prevent_default_directions = ['left','right'];
      }

      window.ionic.onGesture('release', function(e) {
        self._handleEndDrag(e);
      }, self.el, gestureOpts);

      window.ionic.onGesture('drag', function(e) {
        self._handleDrag(e);
      }, self.el, gestureOpts);
      // Start the drag states
      self._initDrag();
    },

    /**
     * Be sure to cleanup references.
     */
    deregister: function() {
      this.el = this.listEl = this.scrollEl = this.scrollView = null;

      // ensure no scrolls have been left frozen
      if (this.isScrollFreeze) {
        self.scrollView.freeze(false);
      }
    },

    /**
     * Called to tell the list to stop refreshing. This is useful
     * if you are refreshing the list and are done with refreshing.
     */
    stopRefreshing: function() {
      var refresher = this.el.querySelector('.list-refresher');
      refresher.style.height = '0';
    },

    /**
     * If we scrolled and have virtual mode enabled, compute the window
     * of active elements in order to figure out the viewport to render.
     */
    didScroll: function(e) {
      var self = this;

      if (self.isVirtual) {
        var itemHeight = self.itemHeight;

        // TODO: This would be inaccurate if we are windowed
        var totalItems = self.listEl.children.length;

        // Grab the total height of the list
        var scrollHeight = e.target.scrollHeight;

        // Get the viewport height
        var viewportHeight = self.el.parentNode.offsetHeight;

        // scrollTop is the current scroll position
        var scrollTop = e.scrollTop;

        // High water is the pixel position of the first element to include (everything before
        // that will be removed)
        var highWater = Math.max(0, e.scrollTop + self.virtualRemoveThreshold);

        // Low water is the pixel position of the last element to include (everything after
        // that will be removed)
        var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + self.virtualAddThreshold);

        // Compute how many items per viewport size can show
        var itemsPerViewport = Math.floor((lowWater - highWater) / itemHeight);

        // Get the first and last elements in the list based on how many can fit
        // between the pixel range of lowWater and highWater
        var first = parseInt(Math.abs(highWater / itemHeight), 10);
        var last = parseInt(Math.abs(lowWater / itemHeight), 10);

        // Get the items we need to remove
        self._virtualItemsToRemove = Array.prototype.slice.call(self.listEl.children, 0, first);

        // Grab the nodes we will be showing
        var nodes = Array.prototype.slice.call(self.listEl.children, first, first + itemsPerViewport);

        self.renderViewport && self.renderViewport(highWater, lowWater, first, last);
      }
    },

    didStopScrolling: function(e) {
      if (this.isVirtual) {
        for (var i = 0; i < this._virtualItemsToRemove.length; i++) {
          var el = this._virtualItemsToRemove[i];
          //el.parentNode.removeChild(el);
          this.didHideItem && this.didHideItem(i);
        }
        // Once scrolling stops, check if we need to remove old items

      }
    },

    /**
     * Clear any active drag effects on the list.
     */
    clearDragEffects: function(isInstant) {
      if (this._lastDragOp) {
        this._lastDragOp.clean && this._lastDragOp.clean(isInstant);
        this._lastDragOp.deregister && this._lastDragOp.deregister();
        this._lastDragOp = null;
      }
    },

    _initDrag: function() {
      // Store the last one
      if (this._lastDragOp) {
        this._lastDragOp.deregister && this._lastDragOp.deregister();
      }
      this._lastDragOp = this._dragOp;

      this._dragOp = null;
    },

    // Return the list item from the given target
    _getItem: function(target) {
      while (target) {
        if (target.classList && target.classList.contains(ITEM_CLASS)) {
          return target;
        }
        target = target.parentNode;
      }
      return null;
    },


    _startDrag: function(e) {
      var self = this;

      var didStart = false;

      self._isDragging = false;

      var lastDragOp = self._lastDragOp;
      var item;

      // If we have an open SlideDrag and we're scrolling the list. Clear it.
      if (self._didDragUpOrDown && lastDragOp instanceof SlideDrag) {
          lastDragOp.clean && lastDragOp.clean();
      }

      // Check if this is a reorder drag
      if (ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        item = self._getItem(e.target);

        if (item) {
          self._dragOp = new ReorderDrag({
            listEl: self.el,
            el: item,
            scrollEl: self.scrollEl,
            scrollView: self.scrollView,
            onReorder: function(el, start, end) {
              self.onReorder && self.onReorder(el, start, end);
            }
          });
          self._dragOp.start(e);
          e.preventDefault();
        }
      }

      // Or check if this is a swipe to the side drag
      else if (!self._didDragUpOrDown && (e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {

        // Make sure this is an item with buttons
        item = self._getItem(e.target);
        if (item && item.querySelector('.item-options')) {
          self._dragOp = new SlideDrag({
            el: self.el,
            item: item,
            canSwipe: self.canSwipe
          });
          self._dragOp.start(e);
          e.preventDefault();
          self.isScrollFreeze = self.scrollView.freeze(true);
        }
      }

      // If we had a last drag operation and this is a new one on a different item, clean that last one
      if (lastDragOp && self._dragOp && !self._dragOp.isSameItem(lastDragOp) && e.defaultPrevented) {
        lastDragOp.clean && lastDragOp.clean();
      }
    },


    _handleEndDrag: function(e) {
      var self = this;

      if (self.scrollView) {
        self.isScrollFreeze = self.scrollView.freeze(false);
      }

      self._didDragUpOrDown = false;

      if (!self._dragOp) {
        return;
      }

      self._dragOp.end(e, function() {
        self._initDrag();
      });
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var self = this, content, buttons;

      if (Math.abs(e.gesture.deltaY) > 5) {
        self._didDragUpOrDown = true;
      }

      // If we get a drag event, make sure we aren't in another drag, then check if we should
      // start one
      if (!self.isDragging && !self._dragOp) {
        self._startDrag(e);
      }

      // No drag still, pass it up
      if (!self._dragOp) {
        return;
      }

      e.gesture.srcEvent.preventDefault();
      self._dragOp.drag(e);
    }

  });

})(ionic);
