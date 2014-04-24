
IonicModule
.factory('$collectionRepeatManager', [
  '$rootScope',
  '$timeout',
function($rootScope, $timeout) {
  function CollectionRepeatManager(options) {
    var self = this;
    this.dataSource = options.dataSource;
    this.element = options.element;
    this.scrollView = options.scrollView;
    this.itemSizePrimary = options.itemSizePrimary;
    this.itemSizeSecondary = options.itemSizeSecondary;

    this.isVertical = !!this.scrollView.options.scrollingY;
    this.renderedItems = {};

    this.lastRenderScrollValue = this.bufferTransformOffset = this.hasBufferStartIndex =
      this.hasBufferEndIndex = this.bufferItemsLength = 0;

    this.scrollView.__$callback = this.scrollView.__callback;
    this.scrollView.__callback = angular.bind(this, this.renderScroll);

    function getViewportSize() { return self.viewportSize; }
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
      this.getSecondaryScrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.transformString = function(y, x) {
        return 'translate3d('+x+'px,'+y+'px,0)';
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
      this.getSecondaryScrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.transformString = function(x, y) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
    }
  }

  CollectionRepeatManager.prototype = {
    destroy: function() {
      for (var i in this.renderedItems) {
        this.removeItem(i);
      }
    },
    resize: function() {
      var primaryPos = 0;
      var secondaryPos = 0;
      var itemsPerSpace = 0;
      var len = this.dataSource.dimensions.length;
      this.dimensions = this.dataSource.dimensions.map(function(dimensions, index) {
        var rect = {
          primarySize: this.isVertical ? dimensions.height : dimensions.width,
          secondarySize: this.isVertical ? dimensions.width : dimensions.height,
          primaryPos: primaryPos,
          secondaryPos: secondaryPos
        };

        itemsPerSpace++;
        secondaryPos += rect.secondarySize;
        if (secondaryPos >= this.getSecondaryScrollSize()) {
          secondaryPos = 0;
          primaryPos += rect.primarySize;

          if (!this.itemsPerSpace) {
            this.itemsPerSpace = itemsPerSpace;
          }
        }

        return rect;
      }, this);

      this.viewportSize = primaryPos;
      this.setCurrentIndex(0);
      this.lastRenderScrollValue = 0;
      this.render(true);
    },
    setCurrentIndex: function(index, height) {
      this.currentIndex = index;

      this.hasPrevIndex = index > 0;
      if (this.hasPrevIndex) {
        this.previousPos = this.dimensions[index - 1].primaryPos;
      }
      this.hasNextIndex = index + 1 < this.dataSource.getLength();
      if (this.hasNextIndex) {
        this.nextPos = this.dimensions[index + 1].primaryPos;
      }
    },
    renderScroll: ionic.animationFrameThrottle(function(transformLeft, transformTop, zoom, wasResize) {
      if (this.isVertical) {
        transformTop = this.getTransformPosition(transformTop);
      } else {
        transformLeft = this.getTransformPosition(transformLeft);
      }
      return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
    }),
    getTransformPosition: function(transformPos) {
      if ((this.hasNextIndex && transformPos >= this.nextPos) ||
          (this.hasPrevIndex && transformPos < this.previousPos) ||
           Math.abs(transformPos - this.lastRenderScrollValue) > 100) {
        this.render();
      }
      return transformPos - this.lastRenderScrollValue;
    },
    getIndexForScrollValue: function(i, scrollValue) {
      var rect;
      //Scrolling down
      if (scrollValue <= this.dimensions[i].primaryPos) {
        while ( (rect = this.dimensions[i - 1]) && rect.primaryPos > scrollValue) {
          i -= this.itemsPerSpace;
        }
      //Scrolling up
      } else {
        while ( (rect = this.dimensions[i + 1]) && rect.primaryPos < scrollValue) {
          i += this.itemsPerSpace;
        }
      }
      return i;
    },
    render: function(shouldRedrawAll) {
      if (this.currentIndex >= this.dataSource.getLength()) {
        return;
      }

      var i;
      if (shouldRedrawAll) {
        for (i in this.renderedItems) {
          this.removeItem(i);
        }
      }
      var scrollValue = this.scrollValue();
      var scrollDelta = scrollValue - this.lastRenderScrollValue;
      var scrollSize = this.scrollSize();
      var scrollSizeEnd = scrollSize + scrollValue;
      var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);
      var bufferStartIndex = Math.max(0, startIndex - this.itemsPerSpace);
      var startPos = this.dimensions[bufferStartIndex].primaryPos;

      i = bufferStartIndex;
      var rect;
      while ((rect = this.dimensions[i]) && (rect.primaryPos - rect.primarySize < scrollSizeEnd)) {
        this.renderItem(i, rect.primaryPos - startPos, rect.secondaryPos);
        i++;
      }
      var bufferEndIndex = i -1;

      for (i in this.renderedItems) {
        if (i < bufferStartIndex || i > bufferEndIndex) {
          this.removeItem(i);
        }
      }

      this.setCurrentIndex(startIndex);
      this.lastRenderScrollValue = startPos;

      if (!this.dataSource.scope.$$phase) {
        this.dataSource.scope.$digest();
      }
    },
    renderItem: function(dataIndex, primaryPos, secondaryPos) {
      var self = this;
      var item = this.dataSource.getItem(dataIndex);
      if (item) {
        this.dataSource.attachItem(item);
        item.element[0].style[ionic.CSS.TRANSFORM] = this.transformString(
          primaryPos, secondaryPos, secondaryPos
        );
        this.renderedItems[dataIndex] = item;
      } else {
        delete this.renderedItems[dataIndex];
      }
    },
    removeItem: function(dataIndex) {
      var item = this.renderedItems[dataIndex];
      if (item) {
        this.dataSource.detachItem(item);
        delete this.renderedItems[dataIndex];
      }
    }
  };

  return CollectionRepeatManager;
}]);

