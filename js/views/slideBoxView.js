/**
 * The SlideBox is a swipeable, slidable, slideshowable box. Think of any image gallery
 * or iOS "dot" pager gallery, or maybe a carousel.
 *
 * Each screen fills the full width and height of the viewport, and screens can
 * be swiped between, or set to automatically transition.
 */
(function(ionic) {
'use strict';

  ionic.views.SlideBox = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      this.slideChanged = opts.slideChanged || function() {};
      this.el = opts.el;
      this.pager = this.el.querySelector('.slide-box-pager');

      // The drag threshold is the pixel delta that will trigger a drag (to 
      // avoid accidental dragging)
      this.dragThresholdX = opts.dragThresholdX || 10;
      // The velocity threshold is a velocity of drag that indicates a "swipe". This
      // number is taken from hammer.js's calculations
      this.velocityXThreshold = opts.velocityXThreshold || 0.3;

      // Initialize the slide index to the first page and update the pager
      this.slideIndex = 0;
      this._updatePager();

      // Listen for drag and release events
      window.ionic.onGesture('drag', function(e) {
        _this._handleDrag(e);
        e.gesture.srcEvent.preventDefault();
      }, this.el);
      window.ionic.onGesture('release', function(e) {
        _this._handleEndDrag(e);
      }, this.el);
    },

    /**
     * Tell the pager to update itself if content is added or
     * removed. 
     */
    update: function() {
      this._updatePager();
    },

    prependSlide: function(el) {
      var content = this.el.firstElementChild;
      if(!content) { return; }

      var slideWidth = content.offsetWidth;
      var offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      var newOffsetX = Math.min(0, offsetX - slideWidth);
          
      content.insertBefore(el, content.firstChild);

      content.classList.remove('slide-box-animating');
      content.style.webkitTransform = 'translate3d(' + newOffsetX + 'px, 0, 0)';

      this._prependPagerIcon();
      this.slideIndex = (this.slideIndex + 1) % content.children.length;
      this._updatePager();
    },

    appendSlide: function(el) {
      var content = this.el.firstElementChild;
      if(!content) { return; }

      content.classList.remove('slide-box-animating');
      content.appendChild(el);

      this._appendPagerIcon();
      this._updatePager();
    },

    removeSlide: function(index) {
      var content = this.el.firstElementChild;
      if(!content) { return; }

      var items = this.el.firstElementChild;
      items.removeChild(items.firstElementChild);

      var slideWidth = content.offsetWidth;
      var offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      var newOffsetX = Math.min(0, offsetX + slideWidth);
          
      content.classList.remove('slide-box-animating');
      content.style.webkitTransform = 'translate3d(' + newOffsetX + 'px, 0, 0)';

      this._removePagerIcon();
      this.slideIndex = Math.max(0, (this.slideIndex - 1) % content.children.length);
      this._updatePager();
    },

    /**
     * Slide to the given slide index.
     *
     * @param {int} the index of the slide to animate to.
     */
    slideToSlide: function(index) {
      var content = this.el.firstElementChild;
      if(!content) {
        return;
      }

      // Get the width of one slide
      var slideWidth = content.offsetWidth;

      // Calculate the new offsetX position which is just
      // N slides to the left, where N is the given index
      var offsetX = index * slideWidth;

      // Calculate the max X position we'd allow based on how many slides
      // there are.
      var maxX = Math.max(0, content.children.length - 1) * slideWidth;

      // Bounds the offset X position in the range maxX >= offsetX >= 0
      offsetX = offsetX < 0 ? 0 : offsetX > maxX ? maxX : offsetX;

      // Animate and slide the slides over
      content.classList.add('slide-box-animating');
      content.style.webkitTransform = 'translate3d(' + -offsetX + 'px, 0, 0)';

      var lastSlide = this.slideIndex;

      // Update the slide index
      this.slideIndex = Math.ceil(offsetX / slideWidth);

      if(lastSlide !== this.slideIndex) {
        this.slideChanged && this.slideChanged(this.slideIndex);
      }

      this._updatePager();
    },

    /**
     * Get the currently set slide index. This method
     * is updated before any transitions run, so the
     * value could be early.
     *
     * @return {int} the current slide index
     */
    getSlideIndex: function() {
      return this.slideIndex;
    },

    _appendPagerIcon: function() {
      if(!this.pager || !this.pager.children.length) { return; }

      var newPagerChild = this.pager.children[0].cloneNode();
      this.pager.appendChild(newPagerChild);
    },

    _prependPagerIcon: function() {
      if(!this.pager || !this.pager.children.length) { return; }

      var newPagerChild = this.pager.children[0].cloneNode();
      this.pager.insertBefore(newPagerChild, this.pager.firstChild);
    },

    _removePagerIcon: function() {
      if(!this.pager || !this.pager.children.length) { return; }

      this.pager.removeChild(this.pager.firstElementChild);
    },

    /**
     * If we have a pager, update the active page when the current slide
     * changes.
     */
    _updatePager: function() {
      if(!this.pager) {
        return;
      }

      var numPagerChildren = this.pager.children.length;
      if(!numPagerChildren) {
        // No children to update
        return;
      }

      // Update the active state of the pager icons
      for(var i = 0, j = this.pager.children.length; i < j; i++) {
        if(i == this.slideIndex) {
          this.pager.children[i].classList.add('active');
        } else {
          this.pager.children[i].classList.remove('active');
        }
      }
    },

    _initDrag: function() {
      this._isDragging = false;
      this._drag = null;
    },

    _handleEndDrag: function(e) {
      var _this = this,
          finalOffsetX, content, ratio, slideWidth, totalWidth, offsetX;

      window.rAF(function() {
      
        // We didn't have a drag, so just init and leave
        if(!_this._drag) {
          _this._initDrag();
          return;
        }

        // We did have a drag, so we need to snap to the correct spot

        // Grab the content layer
        content = _this._drag.content;

        // Enable transition duration
        content.classList.add('slide-box-animating');

        // Grab the current offset X position
        offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

        // Calculate how wide a single slide is, and their total width
        slideWidth = content.offsetWidth;
        totalWidth = content.offsetWidth * content.children.length;

        // Calculate how far in this slide we've dragged
        ratio = (offsetX % slideWidth) / slideWidth;

        if(ratio >= 0) {
          // Anything greater than zero is too far left, this is an extreme case
          // TODO: Do we need this anymore?
          finalOffsetX = 0;
        } else if(ratio >= -0.5) {
          // We are less than half-way through a drag
          // Sliiide to the left
          finalOffsetX = Math.max(0, Math.floor(Math.abs(offsetX) / slideWidth) * slideWidth);
        } else {
          // We are more than half-way through a drag
          // Sliiide to the right
          finalOffsetX = Math.min(totalWidth - slideWidth, Math.ceil(Math.abs(offsetX) / slideWidth) * slideWidth);
        }


        if(e.gesture.velocityX > _this.velocityXThreshold) {
          if(e.gesture.direction == 'left') {
            _this.slideToSlide(_this.slideIndex + 1);
          } else if(e.gesture.direction == 'right') {
            _this.slideToSlide(_this.slideIndex - 1);
          }
        } else {
          // Calculate the new slide index (or "page")
          _this.slideIndex = Math.ceil(finalOffsetX / slideWidth);

          // Negative offsetX to slide correctly
          content.style.webkitTransform = 'translate3d(' + -finalOffsetX + 'px, 0, 0)';
        }

        _this._initDrag();
      });
    },

    /**
     * Initialize a drag by grabbing the content area to drag, and any other
     * info we might need for the dragging.
     */
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      // Make sure to grab the element we will slide as our target
      content = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'slide-box-slides');
      if(!content) {
        return;
      }

      // Disable transitions during drag
      content.classList.remove('slide-box-animating');

      // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
      offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

      this._drag = {
        content: content,
        startOffsetX: offsetX,
        resist: 1
      };
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this;

      window.rAF(function() {
        var content;

        // We really aren't dragging
        if(!_this._drag) {
          _this._startDrag(e);
        }

        // Sanity
        if(!_this._drag) { return; }

        // Stop any default events during the drag
        e.preventDefault();

        // Check if we should start dragging. Check if we've dragged past the threshold.
        if(!_this._isDragging && (Math.abs(e.gesture.deltaX) > _this.dragThresholdX)) {
          _this._isDragging = true;
        }

        if(_this._isDragging) {
          content = _this._drag.content;

          var newX = _this._drag.startOffsetX + (e.gesture.deltaX / _this._drag.resist);

          var rightMostX = -(content.offsetWidth * Math.max(0, content.children.length - 1));

          if(newX > 0) {
            // We are dragging past the leftmost pane, rubber band
            _this._drag.resist = (newX / content.offsetWidth) + 1.4;
          } else if(newX < rightMostX) {
            // Dragging past the rightmost pane, rubber band
            //newX = Math.min(rightMostX, + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
            _this._drag.resist = (Math.abs(newX) / content.offsetWidth) - 0.6;
          }

          _this._drag.content.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
        }
      });
    }
  });

})(window.ionic);
