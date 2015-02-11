
IonicModule
.factory('$collectionRepeatManager', [
  '$rootScope',
  '$timeout',
function($rootScope, $timeout) {
  /**
   * Vocabulary: "primary" and "secondary" size/direction/position mean
   * "y" and "x" for vertical scrolling, or "x" and "y" for horizontal scrolling.
   */
  function CollectionRepeatManager(options) {
    var self = this;
    this.dataSource = options.dataSource;
    this.element = options.element;
    this.scrollView = options.scrollView;

    this.bufferSize = options.bufferSize || 2;
    this.bufferItems = Math.max(this.bufferSize * 10, 50);

    this.isVertical = !!this.scrollView.options.scrollingY;
    this.renderedItems = {};
    this.dimensions = [];
    this.setCurrentIndex(0);

    //Override scrollview's render callback
    this.scrollView.__$callback = this.scrollView.__callback;
    this.scrollView.__callback = angular.bind(this, this.renderScroll);

    function getViewportSize() { return self.viewportSize; }
    //Set getters and setters to match whether this scrollview is vertical or not
    if (this.isVertical) {
      this.scrollView.options.getContentHeight = getViewportSize;

      this.scrollValue = function() {
        return this.scrollView.__scrollTop;
      };
      this.scrollMaxValue = function() {
        return this.scrollView.__maxScrollTop;
      };
      this.scrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.secondaryScrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.transformString = function(y, x) {
        return 'translate3d(' + x + 'px,' + y + 'px,0)';
      };
      this.primaryDimension = function(dim) {
        return dim.height;
      };
      this.secondaryDimension = function(dim) {
        return dim.width;
      };
    } else {
      this.scrollView.options.getContentWidth = getViewportSize;

      this.scrollValue = function() {
        return this.scrollView.__scrollLeft;
      };
      this.scrollMaxValue = function() {
        return this.scrollView.__maxScrollLeft;
      };
      this.scrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.secondaryScrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.transformString = function(x, y) {
        return 'translate3d(' + x + 'px,' + y + 'px,0)';
      };
      this.primaryDimension = function(dim) {
        return dim.width;
      };
      this.secondaryDimension = function(dim) {
        return dim.height;
      };
    }
  }


  CollectionRepeatManager.prototype = {
    destroy: function() {
      this.renderedItems = {};
      this.render = noop;
      this.calculateDimensions = noop;
      this.dimensions = [];
    },

    /*
     * Pre-calculate the position of all items in the data list.
     * Do this using the provided width and height (primarySize and secondarySize)
     * provided by the dataSource.
     */
    calculateDimensions: function() {
      /*
       * For the sake of explanations below, we're going to pretend we are scrolling
       * vertically: Items are laid out with primarySize being height,
       * secondarySize being width.
       */
      var self = this;
      var primaryPos = 0;
      var secondaryPos = 0;
      var secondaryScrollSize = self.secondaryScrollSize();
      var previousItem;
      var i, len;

      // Skip past every beforeSibling, we want our list to start after those.
      for (i = 0, len = (self.dataSource.beforeSiblings || []).length; i < len; i++) {
        calculateSize(self.dataSource.beforeSiblings[i]);
      }
      var beforeSize = primaryPos + (previousItem && previousItem.primarySize || 0);

      primaryPos = secondaryPos = 0;
      previousItem = null;

      var dimensions = [];
      for (i = 0, len = self.dataSource.dimensions.length; i < len; i++) {
        dimensions.push( calculateSize(self.dataSource.dimensions[i]) );
      }
      var totalSize = primaryPos + (previousItem && previousItem.primarySize || 0);

      return {
        beforeSize: beforeSize,
        totalSize: totalSize,
        dimensions: dimensions
      };

      function calculateSize(dim) {

        //Each dimension is an object {width: Number, height: Number} provided by
        //the dataSource
        var rect = {
          //Get the height out of the dimension object
          primarySize: self.primaryDimension(dim),
          //Max out the item's width to the width of the scrollview
          secondarySize: Math.min(self.secondaryDimension(dim), secondaryScrollSize)
        };

        //If self isn't the first item
        if (previousItem) {
          //Move the item's x position over by the width of the previous item
          secondaryPos += previousItem.secondarySize;
          //If the y position is the same as the previous item and
          //the x position is bigger than the scroller's width
          if (previousItem.primaryPos === primaryPos &&
              secondaryPos + rect.secondarySize > secondaryScrollSize) {
            //Then go to the next row, with x position 0
            secondaryPos = 0;
            primaryPos += previousItem.primarySize;
          }
        }

        rect.primaryPos = primaryPos;
        rect.secondaryPos = secondaryPos;

        previousItem = rect;
        return rect;
      }
    },

    resize: function() {
      var result = this.calculateDimensions();
      this.dimensions = result.dimensions;
      this.viewportSize = result.totalSize;
      this.beforeSize = result.beforeSize;
      this.setCurrentIndex(0);
      this.render(true);
      this.dataSource.transcludeParent[0].style.height = result.totalSize + "px";
      this.dataSource.setup();
    },
    /*
     * setCurrentIndex sets the index in the list that matches the scroller's position.
     * Also save the position in the scroller for next and previous items (if they exist)
     */
    setCurrentIndex: function(index, height) {
      var currentPos = (this.dimensions[index] || {}).primaryPos || 0;
      this.currentIndex = index;

      this.hasPrevIndex = index > 0;
      if (this.hasPrevIndex) {
        this.previousPos = Math.max(
          currentPos - this.dimensions[index - 1].primarySize,
          this.dimensions[index - 1].primaryPos
        );
      }
      this.hasNextIndex = index + 1 < this.dataSource.getLength();
      if (this.hasNextIndex) {
        this.nextPos = Math.min(
          currentPos + this.dimensions[index + 1].primarySize,
          this.dimensions[index + 1].primaryPos
        );
      }
    },
    /**
     * override the scroller's render callback to check if we need to
     * re-render our collection
     */
    renderScroll: ionic.animationFrameThrottle(function(transformLeft, transformTop, zoom, wasResize) {
      if (this.isVertical) {
        this.renderIfNeeded(transformTop);
      } else {
        this.renderIfNeeded(transformLeft);
      }
      return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
    }),

    renderIfNeeded: function(scrollPos) {
      if ((this.hasNextIndex && scrollPos >= this.nextPos) ||
          (this.hasPrevIndex && scrollPos < this.previousPos)) {
           // Math.abs(transformPos - this.lastRenderScrollValue) > 100) {
        this.render();
      }
    },
    /*
     * getIndexForScrollValue: Given the most recent data index and a new scrollValue,
     * find the data index that matches that scrollValue.
     *
     * Strategy (if we are scrolling down): keep going forward in the dimensions list,
     * starting at the given index, until an item with height matching the new scrollValue
     * is found.
     *
     * This is a while loop. In the worst case it will have to go through the whole list
     * (eg to scroll from top to bottom).  The most common case is to scroll
     * down 1-3 items at a time.
     *
     * While this is not as efficient as it could be, optimizing it gives no noticeable
     * benefit.  We would have to use a new memory-intensive data structure for dimensions
     * to fully optimize it.
     */
    getIndexForScrollValue: function(i, scrollValue) {
      var dimensions = this.dimensions;
      var rect;
      //Scrolling up
      if (scrollValue <= dimensions[i].primaryPos) {
        while ( (rect = dimensions[i - 1]) && rect.primaryPos > scrollValue) {
          i--;
        }
      //Scrolling down
      } else {
        while ((rect = dimensions[i + 1]) && rect.primaryPos < scrollValue) {
          i++;
        }
      }
      return i;
    },

    /*
     * render: Figure out the scroll position, the index matching it, and then tell
     * the data source to render the correct items into the DOM.
     */
    render: function(shouldRedrawAll) {
      var i;
      var self = this;
      var isOutOfBounds = (this.currentIndex >= this.dataSource.getLength());
      // We want to remove all the items and redraw everything if we're out of bounds
      // or a flag is passed in.
      if (isOutOfBounds || shouldRedrawAll) {
        for (i in this.renderedItems) {
          this.removeItem(i);
        }
        // Just don't render anything if we're out of bounds
        if (isOutOfBounds) return;
      }

      var rect;
      // The bottom of the viewport
      var scrollValue = this.scrollValue();
      var viewportBottom = scrollValue + this.scrollSize();

      // Get the new start index for scrolling, based on the current scrollValue and
      // the most recent known index
      var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);

      // Add two extra rows above the visible area
      renderStartIndex = this.addRowsToIndex(startIndex, -this.bufferSize);

      // Keep rendering items, adding them until we are past the end of the visible scroll area
      i = renderStartIndex;
      while ((rect = this.dimensions[i]) && (rect.primaryPos - rect.primarySize < viewportBottom) &&
            this.dimensions[i + 1]) {
        i++;
      }

      var renderEndIndex = this.addRowsToIndex(i, this.bufferSize);

      for (i = renderStartIndex; i <= renderEndIndex; i++) {
        rect = this.dimensions[i];
        self.renderItem(i, rect.primaryPos - self.beforeSize, rect.secondaryPos);
      }

      // Remove any items that were rendered and aren't visible anymore
      for (i in this.renderedItems) {
        if (i < renderStartIndex || i > renderEndIndex) this.removeItem(i);
      }

      this.setCurrentIndex(startIndex);
    },
    renderItem: function(dataIndex, primaryPos, secondaryPos) {
      // Attach an item, and set its transform position to the required value
      var item = this.dataSource.attachItemAtIndex(dataIndex);
      var itemDimensions = this.dimensions[dataIndex] || {};
      //console.log(dataIndex, item);
      if (item && item.element) {
        if (item.primaryPos !== primaryPos || item.secondaryPos !== secondaryPos) {
          item.element.css(ionic.CSS.TRANSFORM, this.transformString(
            primaryPos, secondaryPos
          ));
          item.primaryPos = primaryPos;
          item.secondaryPos = secondaryPos;
        }

        var width = this.isVertical ? itemDimensions.secondarySize : itemDimensions.primarySize;
        var height = this.isVertical ? itemDimensions.primarySize : itemDimensions.secondarySize;
        if (item.cssWidth !== width) {
          item.element[0].style.width = width + 'px';
          item.cssWidth = width;
        }
        if (item.cssHeight !== height) {
          item.element[0].style.height = height + 'px';
          item.cssHeight = height;
        }
        // Save the item in rendered items
        this.renderedItems[dataIndex] = item;
      } else {
        // If an item at this index doesn't exist anymore, be sure to delete
        // it from rendered items
        delete this.renderedItems[dataIndex];
      }
    },
    removeItem: function(dataIndex) {
      // Detach a given item
      var item = this.renderedItems[dataIndex];
      if (item) {
        item.primaryPos = item.secondaryPos = null;
        this.dataSource.detachItem(item);
        delete this.renderedItems[dataIndex];
      }
    },
    /*
     * Given an index, how many items do we have to change to get `rowDelta` number of rows up or down?
     * Eg if we are at index 0 and there are 2 items on the first row and 3 items on the second row,
     * to move forward two rows we have to go to index 5.
     * In that case, addRowsToIndex(dim, 0, 2) == 5.
     */
    addRowsToIndex: function(index, rowDelta) {
      var dimensions = this.dimensions;
      var direction = rowDelta > 0 ? 1 : -1;
      var rect;
      var positionOfRow;
      rowDelta = Math.abs(rowDelta);
      do {
        positionOfRow = dimensions[index] && dimensions[index].primaryPos;
        while ((rect = dimensions[index]) && rect.primaryPos === positionOfRow &&
               dimensions[index + direction]) {
          index += direction;
        }
      } while (rowDelta--);
      return index;
    }
  };

  return CollectionRepeatManager;
}]);

