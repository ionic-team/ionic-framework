(function(ionic) {
  var NOOP = function() {};
  var deprecated = function(name) {
    console.error('Method not available in native scrolling: ' + name);
  };
  ionic.views.ScrollNative = ionic.views.View.inherit({

    initialize: function(options) {
      var self = this;
      self.__container = self.el = options.el;
      self.__content = options.el.firstElementChild;
      // Whether scrolling is frozen or not
      self.__frozen = false;
      self.isNative = true;

      self.__scrollTop = self.el.scrollTop;
      self.__scrollLeft = self.el.scrollLeft;
      self.__clientHeight = self.__content.clientHeight;
      self.__clientWidth = self.__content.clientWidth;
      self.__maxScrollTop = Math.max((self.__contentHeight) - self.__clientHeight, 0);
      self.__maxScrollLeft = Math.max((self.__contentWidth) - self.__clientWidth, 0);

      if(options.startY >= 0 || options.startX >= 0) {
        ionic.requestAnimationFrame(function() {
          self.el.scrollTop = options.startY || 0;
          self.el.scrollLeft = options.startX || 0;

          self.__scrollTop = self.el.scrollTop;
          self.__scrollLeft = self.el.scrollLeft;
        });
      }

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

      self.freeze = function(shouldFreeze) {
        self.__frozen = shouldFreeze;
      };
      // A more powerful freeze pop that dominates all other freeze pops
      self.freezeShut = function(shouldFreezeShut) {
        self.__frozenShut = shouldFreezeShut;
      };

      self.__initEventHandlers();
    },

    /**  Methods not used in native scrolling */
    __callback: function() { deprecated('__callback'); },
    zoomTo: function() { deprecated('zoomTo'); },
    zoomBy: function() { deprecated('zoomBy'); },
    activatePullToRefresh: function() { deprecated('activatePullToRefresh'); },

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

      var oldOverflowX = self.el.style.overflowX;
      var oldOverflowY = self.el.style.overflowY;

      clearTimeout(self.__scrollToCleanupTimeout);
      self.__scrollToCleanupTimeout = setTimeout(function() {
        self.el.style.overflowX = oldOverflowX;
        self.el.style.overflowY = oldOverflowY;
      }, 500);

      self.el.style.overflowY = 'hidden';
      self.el.style.overflowX = 'hidden';

      animateScroll(top, left);

      function animateScroll(Y, X) {
        // scroll animation loop w/ easing
        // credit https://gist.github.com/dezinezync/5487119
        var start = Date.now(),
          duration = 250, //milliseconds
          fromY = self.el.scrollTop,
          fromX = self.el.scrollLeft;

        if (fromY === Y && fromX === X) {
          self.el.style.overflowX = oldOverflowX;
          self.el.style.overflowY = oldOverflowY;
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
            ionic.tap.removeClonedInputs(self.__container, self);
            self.el.style.overflowX = oldOverflowX;
            self.el.style.overflowY = oldOverflowY;
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
      // save height when scroll view is shrunk so we don't need to reflow
      var scrollViewOffsetHeight;

      var lastKeyboardHeight;

      /**
       * Shrink the scroll view when the keyboard is up if necessary and if the
       * focused input is below the bottom of the shrunk scroll view, scroll it
       * into view.
       */
      self.scrollChildIntoView = function(e) {
        var rect = container.getBoundingClientRect();
        if(!self.__originalContainerHeight) {
          self.__originalContainerHeight = rect.height;
        }

        // D
        //var scrollBottomOffsetToTop = rect.bottom;
        // D - A
        scrollViewOffsetHeight = self.__originalContainerHeight;
        //console.log('Scroll view offset height', scrollViewOffsetHeight);
        //console.dir(container);
        var alreadyShrunk = self.isShrunkForKeyboard;

        var isModal = container.parentNode.classList.contains('modal');
        var isPopover = container.parentNode.classList.contains('popover');
        // 680px is when the media query for 60% modal width kicks in
        var isInsetModal = isModal && window.innerWidth >= 680;

       /*
        *  _______
        * |---A---| <- top of scroll view
        * |       |
        * |---B---| <- keyboard
        * |   C   | <- input
        * |---D---| <- initial bottom of scroll view
        * |___E___| <- bottom of viewport
        *
        *  All commented calculations relative to the top of the viewport (ie E
        *  is the viewport height, not 0)
        */


        var changedKeyboardHeight = lastKeyboardHeight && (lastKeyboardHeight !== e.detail.keyboardHeight);

        if (!alreadyShrunk || changedKeyboardHeight) {
          // shrink scrollview so we can actually scroll if the input is hidden
          // if it isn't shrink so we can scroll to inputs under the keyboard
          // inset modals won't shrink on Android on their own when the keyboard appears
          if ( !isPopover && (ionic.Platform.isIOS() || ionic.Platform.isFullScreen || isInsetModal) ) {
            // if there are things below the scroll view account for them and
            // subtract them from the keyboard height when resizing
            // E - D                         E                         D
            //var scrollBottomOffsetToBottom = e.detail.viewportHeight - scrollBottomOffsetToTop;

            // 0 or D - B if D > B           E - B                     E - D
            //var keyboardOffset = e.detail.keyboardHeight - scrollBottomOffsetToBottom;

            ionic.requestAnimationFrame(function(){
              // D - A or B - A if D > B       D - A             max(0, D - B)
              scrollViewOffsetHeight = Math.max(0, Math.min(self.__originalContainerHeight, self.__originalContainerHeight - (e.detail.keyboardHeight - 43)));//keyboardOffset >= 0 ? scrollViewOffsetHeight - keyboardOffset : scrollViewOffsetHeight + keyboardOffset;

              //console.log('Old container height', self.__originalContainerHeight, 'New container height', scrollViewOffsetHeight, 'Keyboard height', e.detail.keyboardHeight);

              container.style.height = scrollViewOffsetHeight + "px";

              /*
              if (ionic.Platform.isIOS()) {
                // Force redraw to avoid disappearing content
                var disp = container.style.display;
                container.style.display = 'none';
                var trick = container.offsetHeight;
                container.style.display = disp;
              }
              */
              container.classList.add('keyboard-up');
              //update scroll view
              self.resize();
            });
          }

          self.isShrunkForKeyboard = true;
        }

        lastKeyboardHeight = e.detail.keyboardHeight;

        /*
         *  _______
         * |---A---| <- top of scroll view
         * |   *   | <- where we want to scroll to
         * |--B-D--| <- keyboard, bottom of scroll view
         * |   C   | <- input
         * |       |
         * |___E___| <- bottom of viewport
         *
         *  All commented calculations relative to the top of the viewport (ie E
         *  is the viewport height, not 0)
         */
        // if the element is positioned under the keyboard scroll it into view
        if (e.detail.isElementUnderKeyboard) {

          ionic.requestAnimationFrame(function(){
            var pos = ionic.DomUtil.getOffsetTop(e.detail.target);
            setTimeout(function() {
              if (ionic.Platform.isIOS()) {
                ionic.tap.cloneFocusedInput(container, self);
              }
              // Scroll the input into view, with a 100px buffer
              self.scrollTo(0, pos - (rect.top + 100), true);
              self.onScroll();
            }, 32);

            /*
            // update D if we shrunk
            if (self.isShrunkForKeyboard && !alreadyShrunk) {
              scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
              console.log('Scroll bottom', scrollBottomOffsetToTop);
            }

            // middle of the scrollview, this is where we want to scroll to
            // (D - A) / 2
            var scrollMidpointOffset = scrollViewOffsetHeight * 0.5;
            console.log('Midpoint', scrollMidpointOffset);
            //console.log("container.offsetHeight: " + scrollViewOffsetHeight);

            // middle of the input we want to scroll into view
            // C
            var inputMidpoint = ((e.detail.elementBottom + e.detail.elementTop) / 2);
            console.log('Input midpoint');

            // distance from middle of input to the bottom of the scroll view
            // C - D                                C               D
            var inputMidpointOffsetToScrollBottom = inputMidpoint - scrollBottomOffsetToTop;
            console.log('Input midpoint offset', inputMidpointOffsetToScrollBottom);

            //C - D + (D - A)/2          C - D                     (D - A)/ 2
            var scrollTop = inputMidpointOffsetToScrollBottom + scrollMidpointOffset;
            console.log('Scroll top', scrollTop);

            if ( scrollTop > 0) {
              if (ionic.Platform.isIOS()) {
                //just shrank scroll view, give it some breathing room before scrolling
                setTimeout(function(){
                  ionic.tap.cloneFocusedInput(container, self);
                  self.scrollBy(0, scrollTop, true);
                  self.onScroll();
                }, 32);
              } else {
                self.scrollBy(0, scrollTop, true);
                self.onScroll();
              }
            }
            */
          });
        }

        // Only the first scrollView parent of the element that broadcasted this event
        // (the active element that needs to be shown) should receive this event
        e.stopPropagation();
      };

      self.resetScrollView = function() {
        //return scrollview to original height once keyboard has hidden
        if (self.isShrunkForKeyboard) {
          self.isShrunkForKeyboard = false;
          container.style.height = "";

          /*
          if (ionic.Platform.isIOS()) {
            // Force redraw to avoid disappearing content
            var disp = container.style.display;
            container.style.display = 'none';
            var trick = container.offsetHeight;
            container.style.display = disp;
          }
          */

          self.__originalContainerHeight = container.getBoundingClientRect().height;

          if (ionic.Platform.isIOS()) {
            ionic.requestAnimationFrame(function() {
              container.classList.remove('keyboard-up');
            });
          }

        }
        self.resize();
      };

      self.handleTouchMove = function(e) {
        if (self.__frozenShut) {
          e.preventDefault();
          e.stopPropagation();
          return false;

        } else if ( self.__frozen ){
          e.preventDefault();
          // let it propagate so other events such as drag events can happen,
          // but don't let it actually scroll
          return false;
        }
        return true;
      };

      container.addEventListener('scroll', self.onScroll);

      //Broadcasted when keyboard is shown on some platforms.
      //See js/utils/keyboard.js
      container.addEventListener('scrollChildIntoView', self.scrollChildIntoView);

      container.addEventListener(ionic.EVENTS.touchstart, self.handleTouchMove);
      container.addEventListener(ionic.EVENTS.touchmove, self.handleTouchMove);

      // Listen on document because container may not have had the last
      // keyboardActiveElement, for example after closing a modal with a focused
      // input and returning to a previously resized scroll view in an ion-content.
      // Since we can only resize scroll views that are currently visible, just resize
      // the current scroll view when the keyboard is closed.
      document.addEventListener('resetScrollView', self.resetScrollView);
    },

    __cleanup: function() {
      var self = this;
      var container = self.__container;

      container.removeEventListener('resetScrollView', self.resetScrollView);
      container.removeEventListener('scroll', self.onScroll);

      container.removeEventListener('scrollChildIntoView', self.scrollChildIntoView);
      container.removeEventListener('resetScrollView', self.resetScrollView);

      container.removeEventListener(ionic.EVENTS.touchstart, self.handleTouchMove);
      container.removeEventListener(ionic.EVENTS.touchmove, self.handleTouchMove);

      ionic.tap.removeClonedInputs(container, self);

      delete self.__container;
      delete self.__content;
      delete self.__indicatorX;
      delete self.__indicatorY;
      delete self.options.el;

      self.resize = self.scrollTo = self.onScroll = self.resetScrollView = NOOP;
      self.scrollChildIntoView = NOOP;
      container = null;
    }
  });

})(ionic);
