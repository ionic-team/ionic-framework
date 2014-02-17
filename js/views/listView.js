(function(ionic) {
'use strict';

  var ITEM_CLASS = 'item';
  var ITEM_CONTENT_CLASS = 'item-content';
  var ITEM_SLIDING_CLASS = 'item-sliding';
  var ITEM_OPTIONS_CLASS = 'item-options';
  var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
  var ITEM_REORDERING_CLASS = 'item-reordering';
  var ITEM_DRAG_CLASS = 'item-drag';

  var DragOp = function() {};
  DragOp.prototype = {
    start: function(e) {
    },
    drag: function(e) {
    },
    end: function(e) {
    }
  };



  var SlideDrag = function(opts) {
    this.dragThresholdX = opts.dragThresholdX || 10;
    this.el = opts.el;
  };

  SlideDrag.prototype = new DragOp();
  SlideDrag.prototype.start = function(e) {
    var content, buttons, offsetX, buttonsWidth;

    if(e.target.classList.contains(ITEM_CONTENT_CLASS)) {
      content = e.target;
    } else if(e.target.classList.contains(ITEM_CLASS)) {
      content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
    }

    // If we don't have a content area as one of our children (or ourselves), skip
    if(!content) {
      return;
    }

    // Make sure we aren't animating as we slide
    content.classList.remove(ITEM_SLIDING_CLASS);

    // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
    offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

    // Grab the buttons
    buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
    if(!buttons) {
      return;
    }

    buttonsWidth = buttons.offsetWidth;

    this._currentDrag = {
      buttonsWidth: buttonsWidth,
      content: content,
      startOffsetX: offsetX
    };
  };

  SlideDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
    var buttonsWidth;

    // We really aren't dragging
    if(!this._currentDrag) {
      return;
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if(!this._isDragging &&
        ((Math.abs(e.gesture.deltaX) > this.dragThresholdX) ||
        (Math.abs(this._currentDrag.startOffsetX) > 0)))
    {
      this._isDragging = true;
    }

    if(this._isDragging) {
      buttonsWidth = this._currentDrag.buttonsWidth;

      // Grab the new X point, capping it at zero
      var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);

      // If the new X position is past the buttons, we need to slow down the drag (rubber band style)
      if(newX < -buttonsWidth) {
        // Calculate the new X position, capped at the top of the buttons
        newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
      }

      this._currentDrag.content.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
      this._currentDrag.content.style.webkitTransition = 'none';
    }
  });

  SlideDrag.prototype.end = function(e, doneCallback) {
    var _this = this;

    // There is no drag, just end immediately
    if(!this._currentDrag) {
      doneCallback && doneCallback();
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

    // var content = this._currentDrag.content;

    // var onRestingAnimationEnd = function(e) {
    //   if(e.propertyName == '-webkit-transform') {
    //     if(content) content.classList.remove(ITEM_SLIDING_CLASS);
    //   }
    //   e.target.removeEventListener('webkitTransitionEnd', onRestingAnimationEnd);
    // };

    ionic.requestAnimationFrame(function() {
      // var currentX = parseFloat(_this._currentDrag.content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      // if(currentX !== restingPoint) {
      //   _this._currentDrag.content.classList.add(ITEM_SLIDING_CLASS);
      //   _this._currentDrag.content.addEventListener('webkitTransitionEnd', onRestingAnimationEnd);
      // }
      if(restingPoint === 0) {
        _this._currentDrag.content.style.webkitTransform = '';
      } else {
        _this._currentDrag.content.style.webkitTransform = 'translate3d(' + restingPoint + 'px, 0, 0)';
      }
      _this._currentDrag.content.style.webkitTransition = '';


      // Kill the current drag
      _this._currentDrag = null;


      // We are done, notify caller
      doneCallback && doneCallback();
    });
  };

  var ReorderDrag = function(opts) {
    this.dragThresholdY = opts.dragThresholdY || 0;
    this.onReorder = opts.onReorder;
    this.el = opts.el;
    this.scrollEl = opts.scrollEl;
    this.scrollView = opts.scrollView;
  };

  ReorderDrag.prototype = new DragOp();

  ReorderDrag.prototype._moveElement = function(e) {
    var y = (e.gesture.center.pageY - this._currentDrag.elementHeight/2);
    this.el.style.webkitTransform = 'translate3d(0, '+y+'px, 0)';
  };

  ReorderDrag.prototype.start = function(e) {
    var content;


    // Grab the starting Y point for the item
    var offsetY = this.el.offsetTop;//parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;

    var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
    var elementHeight = this.el.offsetHeight;
    var placeholder = this.el.cloneNode(true);

    // If we have a scroll pane, move our draggable element outside of it
    // We do this because when we drag our element down below the edge of the page
    // and scroll the scroll-pane, if the element is *part* of the scroll-pane,
    // it will scroll 'with' the scroll-pane's contents and change position.
    var appendToElement = (this.scrollEl || this.el).parentNode;

    placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);

    this.el.parentNode.insertBefore(placeholder, this.el);
    this.el.classList.add(ITEM_REORDERING_CLASS);

    appendToElement.parentNode.appendChild(this.el);

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
    if(!this._currentDrag) {
      return;
    }

    var scrollY = 0;
    var pageY = e.gesture.center.pageY;

    //If we have a scrollView, check scroll boundaries for dragged element and scroll if necessary
    if (this.scrollView) {
      var container = this.scrollEl;

      scrollY = this.scrollView.getValues().top;

      var containerTop = container.offsetTop;
      var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight/2;
      var pixelsPastBottom = pageY + this._currentDrag.elementHeight/2 - containerTop - container.offsetHeight;

      if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
        this.scrollView.scrollBy(null, -pixelsPastTop);
      }
      if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
        if (scrollY < this.scrollView.getScrollMax().top) {
          this.scrollView.scrollBy(null, pixelsPastBottom);
        }
      }
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if(!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
      this._isDragging = true;
    }

    if(this._isDragging) {
      this._moveElement(e);

      this._currentDrag.currentY = scrollY + pageY - this._currentDrag.placeholder.parentNode.offsetTop;

      this._reorderItems();
    }
  });

  // When an item is dragged, we need to reorder any items for sorting purposes
  ReorderDrag.prototype._reorderItems = function() {
    var placeholder = this._currentDrag.placeholder;
    var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children);

    var index = siblings.indexOf(this._currentDrag.placeholder);
    var topSibling = siblings[Math.max(0, index - 1)];
    var bottomSibling = siblings[Math.min(siblings.length, index+1)];
    var thisOffsetTop = this._currentDrag.currentY;// + this._currentDrag.startOffsetTop;

    if(topSibling && (thisOffsetTop < topSibling.offsetTop + topSibling.offsetHeight/2)) {
      ionic.DomUtil.swapNodes(this._currentDrag.placeholder, topSibling);
      return index - 1;
    } else if(bottomSibling && thisOffsetTop > (bottomSibling.offsetTop + bottomSibling.offsetHeight/2)) {
      ionic.DomUtil.swapNodes(bottomSibling, this._currentDrag.placeholder);
      return index + 1;
    }
  };

  ReorderDrag.prototype.end = function(e, doneCallback) {
    if(!this._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    var placeholder = this._currentDrag.placeholder;
    var finalPosition = ionic.DomUtil.getChildIndex(placeholder, placeholder.nodeName.toLowerCase());

    // Reposition the element
    this.el.classList.remove(ITEM_REORDERING_CLASS);
    this.el.style.webkitTransform = '';

    placeholder.parentNode.insertBefore(this.el, placeholder);
    placeholder.parentNode.removeChild(placeholder);

    this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalPosition);

    this._currentDrag = null;
    doneCallback && doneCallback();
  };



  /**
   * The ListView handles a list of items. It will process drag animations, edit mode,
   * and other operations that are common on mobile lists or table views.
   */
  ionic.views.ListView = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      opts = ionic.extend({
        onReorder: function(el, oldIndex, newIndex) {},
        virtualRemoveThreshold: -200,
        virtualAddThreshold: 200
      }, opts);

      ionic.extend(this, opts);

      if(!this.itemHeight && this.listEl) {
        this.itemHeight = this.listEl.children[0] && parseInt(this.listEl.children[0].style.height, 10);
      }

      //ionic.views.ListView.__super__.initialize.call(this, opts);

      this.onRefresh = opts.onRefresh || function() {};
      this.onRefreshOpening = opts.onRefreshOpening || function() {};
      this.onRefreshHolding = opts.onRefreshHolding || function() {};

      window.ionic.onGesture('touch', function(e) {
        _this._handleTouch(e);
      }, this.el);

      window.ionic.onGesture('release', function(e) {
        _this._handleEndDrag(e);
      }, this.el);

      window.ionic.onGesture('drag', function(e) {
        _this._handleDrag(e);
      }, this.el);
      // Start the drag states
      this._initDrag();
    },
    /**
     * Called to tell the list to stop refreshing. This is useful
     * if you are refreshing the list and are done with refreshing.
     */
    stopRefreshing: function() {
      var refresher = this.el.querySelector('.list-refresher');
      refresher.style.height = '0px';
    },

    /**
     * If we scrolled and have virtual mode enabled, compute the window
     * of active elements in order to figure out the viewport to render.
     */
    didScroll: function(e) {
      if(this.isVirtual) {
        var itemHeight = this.itemHeight;

        // TODO: This would be inaccurate if we are windowed
        var totalItems = this.listEl.children.length;

        // Grab the total height of the list
        var scrollHeight = e.target.scrollHeight;

        // Get the viewport height
        var viewportHeight = this.el.parentNode.offsetHeight;

        // scrollTop is the current scroll position
        var scrollTop = e.scrollTop;

        // High water is the pixel position of the first element to include (everything before
        // that will be removed)
        var highWater = Math.max(0, e.scrollTop + this.virtualRemoveThreshold);

        // Low water is the pixel position of the last element to include (everything after
        // that will be removed)
        var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + this.virtualAddThreshold);

        // Compute how many items per viewport size can show
        var itemsPerViewport = Math.floor((lowWater - highWater) / itemHeight);

        // Get the first and last elements in the list based on how many can fit
        // between the pixel range of lowWater and highWater
        var first = parseInt(Math.abs(highWater / itemHeight), 10);
        var last = parseInt(Math.abs(lowWater / itemHeight), 10);

        // Get the items we need to remove
        this._virtualItemsToRemove = Array.prototype.slice.call(this.listEl.children, 0, first);

        // Grab the nodes we will be showing
        var nodes = Array.prototype.slice.call(this.listEl.children, first, first + itemsPerViewport);

        this.renderViewport && this.renderViewport(highWater, lowWater, first, last);
      }
    },

    didStopScrolling: function(e) {
      if(this.isVirtual) {
        for(var i = 0; i < this._virtualItemsToRemove.length; i++) {
          var el = this._virtualItemsToRemove[i];
          //el.parentNode.removeChild(el);
          this.didHideItem && this.didHideItem(i);
        }
        // Once scrolling stops, check if we need to remove old items

      }
    },

    _initDrag: function() {
      //ionic.views.ListView.__super__._initDrag.call(this);

      //this._isDragging = false;
      this._dragOp = null;
    },

    // Return the list item from the given target
    _getItem: function(target) {
      while(target) {
        if(target.classList.contains(ITEM_CLASS)) {
          return target;
        }
        target = target.parentNode;
      }
      return null;
    },


    _startDrag: function(e) {
      var _this = this;

      this._isDragging = false;

      // Check if this is a reorder drag
      if(ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_DRAG_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        var item = this._getItem(e.target);

        if(item) {
          this._dragOp = new ReorderDrag({
            el: item,
            scrollEl: this.scrollEl,
            scrollView: this.scrollView,
            onReorder: function(el, start, end) {
              _this.onReorder && _this.onReorder(el, start, end);
            }
          });
          this._dragOp.start(e);
          e.preventDefault();
          return;
        }
      }

      // Or check if this is a swipe to the side drag
      else if((e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {
        this._dragOp = new SlideDrag({ el: this.el });
        this._dragOp.start(e);
        e.preventDefault();
        return;
      }

      // We aren't handling it, so pass it up the chain
      //ionic.views.ListView.__super__._startDrag.call(this, e);
    },


    _handleEndDrag: function(e) {
      var _this = this;

      if(!this._dragOp) {
        //ionic.views.ListView.__super__._handleEndDrag.call(this, e);
        return;
      }

      // Cancel touch timeout
      clearTimeout(this._touchTimeout);
      var items = _this.el.querySelectorAll('.item');
      for(var i = 0, l = items.length; i < l; i++) {
        items[i].classList.remove('active');
      }

      this._dragOp.end(e, function() {
        _this._initDrag();
      });
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this, content, buttons;

      // If the user has a touch timeout to highlight an element, clear it if we
      // get sufficient draggage
      if(Math.abs(e.gesture.deltaX) > 10 || Math.abs(e.gesture.deltaY) > 10) {
        clearTimeout(this._touchTimeout);
      }

      clearTimeout(this._touchTimeout);
      // If we get a drag event, make sure we aren't in another drag, then check if we should
      // start one
      if(!this.isDragging && !this._dragOp) {
        this._startDrag(e);
      }

      // No drag still, pass it up
      if(!this._dragOp) {
        //ionic.views.ListView.__super__._handleDrag.call(this, e);
        return;
      }

      e.gesture.srcEvent.preventDefault();
      this._dragOp.drag(e);
    },

    /**
     * Handle the touch event to show the active state on an item if necessary.
     */
    _handleTouch: function(e) {
      var _this = this;

      var item = ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_CLASS);
      if(!item) { return; }

      this._touchTimeout = setTimeout(function() {
        var items = _this.el.querySelectorAll('.item');
        for(var i = 0, l = items.length; i < l; i++) {
          items[i].classList.remove('active');
        }
        item.classList.add('active');
      }, 250);
    },

  });

})(ionic);
