(function(ionic) {
  var NOOP = function() {};
  var depreciated = function(name) {
    console.error('Method not available in native scrolling: ' + name);
  };
  ionic.views.ScrollNative = ionic.views.View.inherit({

    initialize: function(options) {
      var self = this;
      self.__container = self.el = options.el;
      self.__content = options.el.firstElementChild;
      self.isNative = true;

      self.__scrollTop = self.el.scrollTop;
      self.__scrollLeft = self.el.scrollLeft;
      self.__clientHeight = self.__content.clientHeight;
      self.__clientWidth = self.__content.clientWidth;
      self.__maxScrollTop = Math.max((self.__contentHeight) - self.__clientHeight, 0);
      self.__maxScrollLeft = Math.max((self.__contentWidth) - self.__clientWidth, 0);

      self.options = {

        freeze: false,

        getContentWidth: function() {
          return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
        },

        getContentHeight: function() {
          return Math.max(self.__content.scrollHeight, self.__content.offsetHeight + (self.__content.offsetTop * 2));
        }

      };

      for (var key in options) {
        self.options[key] = options[key];
      }

      /**
       * Sets isScrolling to true, and automatically deactivates if not called again in 80ms.
       */
      self.onScroll = function() {
        if (!ionic.scroll.isScrolling) {
          ionic.scroll.isScrolling = true;
        }

        clearTimeout(self.scrollTimer);
        self.scrollTimer = setTimeout(function() {
          ionic.scroll.isScrolling = false;
        }, 80);
      };

      self.freeze = NOOP;

      self.__initEventHandlers();
    },

    /**  Methods not used in native scrolling */
    __callback: function() { depreciated('__callback'); },
    zoomTo: function() { depreciated('zoomTo'); },
    zoomBy: function() { depreciated('zoomBy'); },
    activatePullToRefresh: function() { depreciated('activatePullToRefresh'); },

    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */
    resize: function(continueScrolling) {
      var self = this;
      if (!self.__container || !self.options) return;

      // Update Scroller dimensions for changed content
      // Add padding to bottom of content
      self.setDimensions(
        self.__container.clientWidth,
        self.__container.clientHeight,
        self.options.getContentWidth(),
        self.options.getContentHeight(),
        continueScrolling
      );
    },

    /**
     * Initialize the scrollview
     * In native scrolling, this only means we need to gather size information
     */
    run: function() {
      this.resize();
    },

    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */
    getValues: function() {
      var self = this;
      self.update();
      return {
        left: self.__scrollLeft,
        top: self.__scrollTop,
        zoom: 1
      };
    },

    /**
     * Updates the __scrollLeft and __scrollTop values to el's current value
     */
    update: function() {
      var self = this;
      self.__scrollLeft = self.el.scrollLeft;
      self.__scrollTop = self.el.scrollTop;
    },

    /**
     * Configures the dimensions of the client (outer) and content (inner) elements.
     * Requires the available space for the outer element and the outer size of the inner element.
     * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
     *
     * @param clientWidth {Integer} Inner width of outer element
     * @param clientHeight {Integer} Inner height of outer element
     * @param contentWidth {Integer} Outer width of inner element
     * @param contentHeight {Integer} Outer height of inner element
     */
    setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {
      var self = this;

      if (!clientWidth && !clientHeight && !contentWidth && !contentHeight) {
        // this scrollview isn't rendered, don't bother
        return;
      }

      // Only update values which are defined
      if (clientWidth === +clientWidth) {
        self.__clientWidth = clientWidth;
      }

      if (clientHeight === +clientHeight) {
        self.__clientHeight = clientHeight;
      }

      if (contentWidth === +contentWidth) {
        self.__contentWidth = contentWidth;
      }

      if (contentHeight === +contentHeight) {
        self.__contentHeight = contentHeight;
      }

      // Refresh maximums
      self.__computeScrollMax();
    },

    /**
     * Returns the maximum scroll values
     *
     * @return {Map} `left` and `top` maximum scroll values
     */
    getScrollMax: function() {
      return {
        left: this.__maxScrollLeft,
        top: this.__maxScrollTop
      };
    },

    /**
     * Scrolls by the given amount in px.
     *
     * @param left {Number} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean} Whether the scrolling should happen using an animation
     */

    scrollBy: function(left, top, animate) {
      var self = this;

      // update scroll vars before refferencing them
      self.update();

      var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
      var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

      self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
    },

    /**
     * Scrolls to the given position in px.
     *
     * @param left {Number} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean} Whether the scrolling should happen using an animation
     */
    scrollTo: function(left, top, animate) {
      var self = this;
      if (!animate) {
        self.el.scrollTop = top;
        self.el.scrollLeft = left;
        self.resize();
        return;
      }
      animateScroll(top, left);

      function animateScroll(Y, X) {
        // scroll animation loop w/ easing
        // credit https://gist.github.com/dezinezync/5487119
        var start = Date.now(),
          duration = 1000, //milliseconds
          fromY = self.el.scrollTop,
          fromX = self.el.scrollLeft;

        if (fromY === Y && fromX === X) {
          self.resize();
          return; /* Prevent scrolling to the Y point if already there */
        }

        // decelerating to zero velocity
        function easeOutCubic(t) {
          return (--t) * t * t + 1;
        }

        // scroll loop
        function animateScrollStep() {
          var currentTime = Date.now(),
            time = Math.min(1, ((currentTime - start) / duration)),
          // where .5 would be 50% of time on a linear scale easedT gives a
          // fraction based on the easing method
            easedT = easeOutCubic(time);

          if (fromY != Y) {
            self.el.scrollTop = parseInt((easedT * (Y - fromY)) + fromY, 10);
          }
          if (fromX != X) {
            self.el.scrollLeft = parseInt((easedT * (X - fromX)) + fromX, 10);
          }

          if (time < 1) {
            ionic.requestAnimationFrame(animateScrollStep);

          } else {
            // done
            self.resize();
          }
        }

        // start scroll loop
        ionic.requestAnimationFrame(animateScrollStep);
      }
    },



    /*
     ---------------------------------------------------------------------------
     PRIVATE API
     ---------------------------------------------------------------------------
     */

    /**
     * If the scroll view isn't sized correctly on start, wait until we have at least some size
     */
    __waitForSize: function() {
      var self = this;

      clearTimeout(self.__sizerTimeout);

      var sizer = function() {
        self.resize(true);
      };

      sizer();
      self.__sizerTimeout = setTimeout(sizer, 500);
    },


    /**
     * Recomputes scroll minimum values based on client dimensions and content dimensions.
     */
    __computeScrollMax: function() {
      var self = this;

      self.__maxScrollLeft = Math.max((self.__contentWidth) - self.__clientWidth, 0);
      self.__maxScrollTop = Math.max((self.__contentHeight) - self.__clientHeight, 0);

      if (!self.__didWaitForSize && !self.__maxScrollLeft && !self.__maxScrollTop) {
        self.__didWaitForSize = true;
        self.__waitForSize();
      }
    },

    __initEventHandlers: function() {
      var self = this;

      // Event Handler
      var container = self.__container;

      // should be unnecessary in native scrolling, but keep in case bugs show up
      self.scrollChildIntoView = NOOP;

      self.resetScrollView = function() {
        //return scrollview to original height once keyboard has hidden
        if (self.isScrolledIntoView) {
          self.isScrolledIntoView = false;
          container.style.height = "";
          container.style.overflow = "";
          self.resize();
          ionic.scroll.isScrolling = false;
        }
      };

      container.addEventListener('resetScrollView', self.resetScrollView);
      container.addEventListener('scroll', self.onScroll);

      //Broadcasted when keyboard is shown on some platforms.
      //See js/utils/keyboard.js
      container.addEventListener('scrollChildIntoView', self.scrollChildIntoView);
      container.addEventListener('resetScrollView', self.resetScrollView);
    },

    __cleanup: function() {
      var self = this;
      var container = self.__container;

      container.removeEventListener('resetScrollView', self.resetScrollView);
      container.removeEventListener('scroll', self.onScroll);

      container.removeEventListener('scrollChildIntoView', self.scrollChildIntoView);
      container.removeEventListener('resetScrollView', self.resetScrollView);

      ionic.tap.removeClonedInputs(container, self);

      delete self.__container;
      delete self.__content;
      delete self.__indicatorX;
      delete self.__indicatorY;
      delete self.options.el;

      self.resize = self.scrollTo = self.onScroll = self.resetScrollView = NOOP;
      container = null;
    }
  });

})(ionic);

